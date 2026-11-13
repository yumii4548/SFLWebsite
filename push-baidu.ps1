# 百度主动推送（普通收录 API）
# 由 deploy.bat 自动调用，也可手动运行：
#   powershell -NoProfile -ExecutionPolicy Bypass -File push-baidu.ps1
#   powershell ... -File push-baidu.ps1 -Force   # 强制推送，忽略内容变更检测
#
# 设计要点：
#  1. Token 存 .baidu-token（已被 .gitignore 忽略，不会进仓库）
#  2. 百度配额按"推送次数"扣，重复推送同一 URL 同样消耗配额
#     -> 默认只在页面内容真正变化时推送，避免把日配额耗尽
#  3. 站点验证未通过时接口返回 site init fail，此处会明确提示

param(
    [switch]$Force
)

$ErrorActionPreference = 'Stop'
$site      = 'https://www.swiftfishlab.cn'
$root      = Split-Path -Parent $MyInvocation.MyCommand.Path
$tokenFile = Join-Path $root '.baidu-token'
$stateFile = Join-Path $root '.baidu-lastpush'

if (-not (Test-Path $tokenFile)) {
    Write-Host "  [SKIP] 未配置 .baidu-token，跳过百度推送。" -ForegroundColor DarkYellow
    Write-Host "         去 ziyuan.baidu.com -> 普通收录 -> API提交 获取准入密钥，"
    Write-Host "         存为: $tokenFile"
    exit 0
}

$token = (Get-Content $tokenFile -Raw).Trim()
if (-not $token) {
    Write-Host "  [SKIP] .baidu-token 为空。" -ForegroundColor DarkYellow
    exit 0
}

# 推送 URL 列表（必须与 sitemap.xml 保持一致，且都是 200 终态 URL）
$urls = @(
    "$site/",
    "$site/partners"
)

# --- 内容变更检测：对会影响页面的文件取指纹 ---
$watch = @(
    'public\index.html',
    'public\partners.html',
    'public\sitemap.xml',
    'public\common.min.js',
    'public\style.min.css'
) | ForEach-Object { Join-Path $root $_ } | Where-Object { Test-Path $_ }

$sb = New-Object System.Text.StringBuilder
foreach ($f in ($watch | Sort-Object)) {
    $h = (Get-FileHash $f -Algorithm SHA256).Hash
    [void]$sb.AppendLine((Split-Path $f -Leaf) + ':' + $h)
}
$fingerprint = (Get-FileHash -InputStream ([IO.MemoryStream]::new([Text.Encoding]::UTF8.GetBytes($sb.ToString()))) -Algorithm SHA256).Hash

$last = if (Test-Path $stateFile) { (Get-Content $stateFile -Raw).Trim() } else { '' }

if (-not $Force -and $last -eq $fingerprint) {
    Write-Host "  [SKIP] 页面内容自上次推送后无变化，跳过以节省百度配额。" -ForegroundColor DarkYellow
    Write-Host "         如需强制推送：push-baidu.ps1 -Force"
    exit 0
}

$endpoint = "http://data.zz.baidu.com/urls?site=$site&token=$token"
$body = $urls -join "`n"

try {
    $resp = Invoke-RestMethod -Uri $endpoint -Method Post -Body $body -ContentType 'text/plain' -TimeoutSec 20
} catch {
    Write-Host "  [WARN] 百度推送请求失败: $($_.Exception.Message)" -ForegroundColor Yellow
    exit 0
}

if ($null -ne $resp.success) {
    Write-Host ("  [OK] 百度推送成功: 提交 {0} 条，今日剩余配额 {1}" -f $resp.success, $resp.remain) -ForegroundColor Green
    if ($null -ne $resp.not_same) {
        Write-Host ("       其中 {0} 条为已收录过的 URL" -f $resp.not_same) -ForegroundColor DarkGray
    }
    [System.IO.File]::WriteAllText($stateFile, $fingerprint, (New-Object System.Text.UTF8Encoding($false)))
    Write-Host "  [OK] 已记录本次内容指纹，下次内容不变时将自动跳过。" -ForegroundColor DarkGray
} elseif ($resp.error) {
    # 常见错误：over quota（配额用尽）/ token is not valid（密钥错误）/ site init fail（站点未验证）
    Write-Host ("  [WARN] 百度推送被拒绝: {0} - {1}" -f $resp.error, $resp.message) -ForegroundColor Yellow
    switch ($resp.error) {
        'over quota'          { Write-Host "         今日推送配额已用完，明天会自动恢复。" }
        'token is not valid'  { Write-Host "         准入密钥无效，请到百度搜索资源平台重新获取。" }
        'site init fail'      { Write-Host "         站点未在百度验证通过，请先在平台完成站点验证。" }
    }
} else {
    Write-Host "  [WARN] 百度推送返回未知结果。" -ForegroundColor Yellow
}

exit 0
