# IndexNow 即时推送（Bing / Yandex / Seznam 通用入口 api.indexnow.org）
# 用法:
#   powershell -NoProfile -ExecutionPolicy Bypass -File indexnow.ps1
#   powershell ... -File indexnow.ps1 -Urls "https://www.swiftfishlab.cn/skin","https://www.swiftfishlab.cn/maps"
# key 文件: 0b6d51337a284dbf922bec0c33a7f238.txt（必须随站点部署到根路径，文件名=密钥）
param(
    [string[]]$Urls
)
$ErrorActionPreference = 'Stop'
$root   = Split-Path -Parent $MyInvocation.MyCommand.Path
$site   = 'https://www.swiftfishlab.cn'
$host_  = 'www.swiftfishlab.cn'

$keyFile = Get-ChildItem -LiteralPath $root -File -Filter '*.txt' |
    Where-Object { $_.Name -match '^[0-9a-f]{32}\.txt$' } | Select-Object -First 1
if (-not $keyFile) {
    Write-Host '  [SKIP] 未找到 IndexNow key 文件（32 位 hex 命名的 .txt）'
    exit 0
}
$key = $keyFile.BaseName

if (-not $Urls -or $Urls.Count -eq 0) {
    $Urls = @(
        "$site/",
        "$site/skin",
        "$site/architecture",
        "$site/addon",
        "$site/maps",
        "$site/pixel-art",
        "$site/vocaloid",
        "$site/archive-convert",
        "$site/partners"
    )
}

$payload = @{
    host        = $host_
    key         = $key
    keyLocation = "$site/$key.txt"
    urlList     = $Urls
} | ConvertTo-Json

try {
    $resp = Invoke-WebRequest -Uri 'https://api.indexnow.org/indexnow' -Method Post `
        -ContentType 'application/json; charset=utf-8' `
        -Body ([System.Text.Encoding]::UTF8.GetBytes($payload)) `
        -UseBasicParsing -TimeoutSec 20
    Write-Host ("  [OK] IndexNow 已推送 {0} 条，HTTP {1}（200/202=受理，400=格式问题，429=提交过快）" -f $Urls.Count, $resp.StatusCode)
} catch {
    Write-Host ("  [WARN] IndexNow 推送失败: {0}" -f $_.Exception.Message)
}
exit 0
