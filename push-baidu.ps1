# 百度主动推送（普通收录 API）
# 由 deploy.bat 自动调用，也可手动运行：
#   powershell -NoProfile -ExecutionPolicy Bypass -File push-baidu.ps1
#
# Token 获取：百度搜索资源平台 -> 普通收录 -> API提交，复制 token
# 写入同目录 .baidu-token（纯文本一行），该文件已被 .gitignore 忽略。

$ErrorActionPreference = 'Stop'
$site      = 'https://www.swiftfishlab.cn'
$root      = Split-Path -Parent $MyInvocation.MyCommand.Path
$tokenFile = Join-Path $root '.baidu-token'

if (-not (Test-Path $tokenFile)) {
    Write-Host "  [SKIP] 未配置 .baidu-token，跳过百度推送。" -ForegroundColor DarkYellow
    Write-Host "         去 ziyuan.baidu.com -> 普通收录 -> API提交 获取 token，"
    Write-Host "         存为: $tokenFile"
    exit 0
}

$token = (Get-Content $tokenFile -Raw).Trim()
if (-not $token) {
    Write-Host "  [SKIP] .baidu-token 为空。" -ForegroundColor DarkYellow
    exit 0
}

# 推送 URL 列表（与 sitemap 保持一致）
$urls = @(
    "$site/",
    "$site/partners"
)

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
} elseif ($resp.error) {
    Write-Host ("  [WARN] 百度推送被拒绝: {0} - {1}" -f $resp.error, $resp.message) -ForegroundColor Yellow
} else {
    Write-Host "  [WARN] 百度推送返回未知结果。" -ForegroundColor Yellow
}

exit 0
