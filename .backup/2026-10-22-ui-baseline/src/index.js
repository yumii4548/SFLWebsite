// 极鱼社 SwiftFishLab - 访客 Cookie 采集 Worker
// 1) 对 HTML 文档请求下发采集 cookie
// 2) 服务端同步记录访问到 D1（sfl_analytics.visits），无需前端上报

const DAY = 86400;
const YEAR = 365 * DAY;

// ===== 保留策略 =====
// 只按「时间窗口」删除过期数据，单条 DELETE 永远有界（最多一小时的数据量）。
// 不做整表 DELETE：Cloudflare 明确说明单条语句删除几十万行/数百 MB 会超出执行限制，
// 而 D1 是单线程库，一条超长语句会把该库上所有其他查询一起阻塞。
const RETENTION_MS = 90 * 86400000; // 保留最近 90 天（改这里即可调整）
const WINDOW_MS = 3600000; // 一个删除窗口 = 1 小时
const WINDOWS_PER_RUN = 24; // 每次维护最多检查 24 个窗口；每小时执行 → 边界不断前移，最终全部覆盖
const MAINTENANCE_INTERVAL_MS = 3600000; // 每个 isolate 每小时最多维护一次
const WRITE_TIMEOUT_MS = 5000; // D1 操作超时保护，绝不拖住 invocation
const UA_MAX_LENGTH = 180; // 截断 UA（单行里最大的字段），显著压小库体积

function uuid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function readCookie(header, name) {
  if (!header) return null;
  for (const part of header.split(';')) {
    const i = part.indexOf('=');
    if (i === -1) continue;
    const key = part.slice(0, i).trim();
    if (key === name) return part.slice(i + 1).trim();
  }
  return null;
}

function collect(request, url) {
  const headers = request.headers;
  const cookieHeader = headers.get('Cookie') || '';
  const referrer = headers.get('Referer') || '';
  const refHost = referrer ? new URL(referrer).host : '';
  const sameSite = url.protocol === 'https:' ? 'SameSite=Lax; Secure' : 'SameSite=Lax';

  const visitor = readCookie(cookieHeader, 'sfl_visitor') || uuid();
  const firstVisit = readCookie(cookieHeader, 'sfl_first_visit') || Date.now();
  const ip = headers.get('CF-Connecting-IP') || headers.get('x-real-ip') || '';
  const curRef = readCookie(cookieHeader, 'sfl_referrer');
  const utm = url.searchParams.get('utm_source');
  const now = Date.now();

  const cookies = [];
  if (readCookie(cookieHeader, 'sfl_visitor') === null) {
    cookies.push(`sfl_visitor=${visitor}; Path=/; Max-Age=${YEAR}; ${sameSite}`);
  }
  if (readCookie(cookieHeader, 'sfl_first_visit') === null) {
    cookies.push(`sfl_first_visit=${firstVisit}; Path=/; Max-Age=${YEAR}; ${sameSite}`);
  }
  cookies.push(`sfl_last_visit=${now}; Path=/; Max-Age=${YEAR}; ${sameSite}`);
  if (refHost && refHost !== url.host && refHost !== curRef) {
    cookies.push(`sfl_referrer=${encodeURIComponent(refHost)}; Path=/; Max-Age=${30 * DAY}; ${sameSite}`);
  }
  if (utm) {
    cookies.push(`sfl_utm_source=${encodeURIComponent(utm)}; Path=/; Max-Age=${30 * DAY}; ${sameSite}`);
  }
  if (ip) {
    cookies.push(`sfl_ip=${encodeURIComponent(ip)}; Path=/; Max-Age=${30 * DAY}; ${sameSite}`);
  }

  return {
    cookies,
    data: {
      visitor,
      firstVisit: Number(firstVisit),
      lastVisit: now,
      ip,
      referrer: refHost,
      utm,
      path: url.pathname,
      userAgent: (headers.get('User-Agent') || '').slice(0, UA_MAX_LENGTH),
    },
  };
}

function isHtmlRequest(request, url) {
  const accept = request.headers.get('Accept') || '';
  const path = url.pathname;
  if (path === '/' || path.endsWith('/')) return true;
  if (path.endsWith('.html')) return true;
  if (accept.includes('text/html')) return true;
  return false;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    const response = await env.ASSETS.fetch(request);

    if (isHtmlRequest(request, url)) {
      const { cookies, data } = collect(request, url);
      if (env.sfl_analytics) {
        // 埋点与保留维护都跑在 waitUntil 内，且都带超时与兜底 catch：
        // 既不阻塞响应，也保证响应状态码永远是静态资源的原始状态码（爬虫不会拿到 5xx）。
        ctx.waitUntil(withTimeout(recordVisit(env.sfl_analytics, data), WRITE_TIMEOUT_MS, 'recordVisit'));
        ctx.waitUntil(withTimeout(runMaintenance(env.sfl_analytics), WRITE_TIMEOUT_MS, 'runMaintenance'));
      }
      if (cookies.length > 0) {
        const newResponse = new Response(response.body, response);
        for (const c of cookies) {
          newResponse.headers.append('Set-Cookie', c);
        }
        return newResponse;
      }
    }

    return response;
  },
};

// 给 waitUntil 里的 D1 操作加超时与兜底：慢查询/失败都不会拖住 invocation，也不会冒泡成 500。
function withTimeout(promise, ms, label) {
  let timer;
  const timeout = new Promise((resolve) => {
    timer = setTimeout(resolve, ms);
  });
  return Promise.race([Promise.resolve(promise), timeout])
    .catch((err) => {
      console.error(`${label} failed:`, err);
    })
    .finally(() => clearTimeout(timer));
}

async function recordVisit(db, data) {
  try {
    await db
      .prepare(
        `INSERT INTO visits (visitor, ip, referrer, utm_source, path, user_agent, first_visit, last_visit, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        data.visitor,
        data.ip || null,
        data.referrer || null,
        data.utm || null,
        data.path,
        data.userAgent || null,
        data.firstVisit,
        data.lastVisit,
        data.lastVisit
      )
      .run();
  } catch (err) {
    console.error('D1 write failed:', err);
  }
}

// 每个 isolate 内的维护节流。多跑几次也无害：重复删除同一窗口只会影响 0 行。
let lastMaintenanceAt = 0;

// created_at 必须有索引，否则每条保留删除都会全表扫描。
// 用 IF NOT EXISTS 自愈，不需要手动跑迁移。
async function ensureIndex(db) {
  try {
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_visits_created_at ON visits (created_at)').run();
  } catch (err) {
    console.error('D1 create index failed:', err);
  }
}

// 保留维护：从当前保留边界向下逐窗口删除。
// 每次最多检查 WINDOWS_PER_RUN 个「1 小时」窗口，所以单条语句涉及的行数永远有界。
// 因为每小时都会跑一次、边界不断前移，所有过期数据最终都会被覆盖删除。
async function runMaintenance(db) {
  const now = Date.now();
  if (now - lastMaintenanceAt < MAINTENANCE_INTERVAL_MS) return;
  lastMaintenanceAt = now;

  await ensureIndex(db);

  const cutoff = now - RETENTION_MS;
  for (let i = 0; i < WINDOWS_PER_RUN; i++) {
    const to = cutoff - i * WINDOW_MS;
    const from = to - WINDOW_MS;
    try {
      await db.prepare('DELETE FROM visits WHERE created_at >= ? AND created_at < ?').bind(from, to).run();
    } catch (err) {
      console.error('D1 retention delete failed:', err);
      return;
    }
  }
}