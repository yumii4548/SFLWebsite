// 极鱼社 SwiftFishLab - 访客 Cookie 采集 Worker
// 1) 对 HTML 文档请求下发采集 cookie
// 2) 服务端同步记录访问到 D1（sfl_analytics.visits），无需前端上报

const DAY = 86400;
const YEAR = 365 * DAY;
// D1 免费版单库上限 500MB，达到 80%（400MB）自动清空
const D1_LIMIT_BYTES = 500 * 1024 * 1024;
const D1_CLEAR_AT = Math.floor(D1_LIMIT_BYTES * 0.8);

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
      userAgent: headers.get('User-Agent') || '',
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
        ctx.waitUntil(recordVisit(env.sfl_analytics, data));
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

async function recordVisit(db, data) {
  try {
    const res = await db
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

    const sizeAfter = res?.meta?.size_after;
    if (sizeAfter && sizeAfter >= D1_CLEAR_AT) {
      console.log(`D1 size ${sizeAfter} >= ${D1_CLEAR_AT}, clearing visits table`);
      await db.prepare('DELETE FROM visits').run();
    }
  } catch (err) {
    console.error('D1 write failed:', err);
  }
}