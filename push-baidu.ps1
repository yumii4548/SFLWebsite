# 百度普通收录推送（普通收录 API）—— 按 URL 内容指纹去重，PS 5.1 兼容
# 用法:
#   powershell -NoProfile -ExecutionPolicy Bypass -File push-baidu.ps1
#   powershell ... -File push-baidu.ps1 -Force    # 忽略变更检测，强制推送全部 URL
#
# 设计要点：
#   1. Token 存 .baidu-token（已被 .gitignore 忽略，不会进仓库）
#   2. 配额按"条"扣：每个 URL 独立记录内容指纹（.baidu-pushed.json），
#      内容没变的 URL 不再推送，省配额；over quota 时整批未受理、不写指纹，
#      明天重跑本脚本会自动只补推剩余的
#   3. 主页 URL 额外混入 common.min.js 指纹（主页正文依赖该 JS 渲染）

param(
    [switch]$Force
)

$ErrorActionPreference = 'Stop'
$site         = 'https://www.swiftfishlab.cn'
$root         = Split-Path -Parent $MyInvocation.MyCommand.Path
$tokenFile    = Join-Path $root '.baidu-token'
$stateFile    = Join-Path $root '.baidu-pushed.json'
$lastRespFile = Join-Path $root '.baidu-lastresponse.json'

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

# URL -> public\ 源文件映射（必须与 sitemap.xml 保持一致，且都是 200 终态 URL）
$map = [ordered]@{
    "$site/"                = @('index.html', 'common.min.js')
    "$site/partners"        = @('partners.html')
    "$site/skin"            = @('skin.html')
    "$site/architecture"    = @('architecture.html')
    "$site/addon"           = @('addon.html')
    "$site/maps"            = @('maps.html')
    "$site/pixel-art"       = @('pixel-art.html')
    "$site/vocaloid"        = @('vocaloid.html')
    "$site/archive-convert" = @('archive-convert.html')
}

function Get-UrlHash([string[]]$files) {
    $ms = New-Object System.IO.MemoryStream
    foreach ($f in $files) {
        $p = Join-Path (Join-Path $root 'public') $f
        if (-not (Test-Path $p)) { return $null }
        $b = [System.IO.File]::ReadAllBytes($p)
        $ms.Write($b, 0, $b.Length)
    }
    $ms.Position = 0
    $sha = New-Object System.Security.Cryptography.SHA256CryptoServiceProvider
    return ([System.BitConverter]::ToString($sha.ComputeHash($ms))).Replace('-', '').ToLowerInvariant()
}

# 读取旧状态（PS 5.1 兼容：遍历 PSObject.Properties，不使用 -AsHashtable）
$state = @{}
if (Test-Path $stateFile) {
    try {
        $raw = Get-Content $stateFile -Raw | ConvertFrom-Json
        foreach ($prop in $raw.PSObject.Properties) { $state[$prop.Name] = [string]$prop.Value }
    } catch {
        Write-Host "  [WARN] .baidu-pushed.json 解析失败，按全新推送处理。"
        $state = @{}
    }
}

# 计算当前指纹，找出待推送 URL
$current = @{}
$pending = @()
foreach ($u in $map.Keys) {
    $h = Get-UrlHash $map[$u]
    if ($null -eq $h) {
        Write-Host "  [SKIP] $u -> 源文件缺失，本次不推送"
        continue
    }
    $current[$u] = $h
    if ($Force -or (-not $state.ContainsKey($u)) -or ($state[$u] -ne $h)) {
        $pending += $u
    }
}

if ($pending.Count -eq 0) {
    Write-Host "  [SKIP] 全部 URL 内容自上次推送后无变化，跳过以节省配额。强制推送请加 -Force"
    exit 0
}
Write-Host ("  [PUSH] 待推送 {0} 条: {1}" -f $pending.Count, ($pending -join ' | '))

$endpoint = "http://data.zz.baidu.com/urls?site=$site&token=$token"
$body = $pending -join "`n"

try {
    $resp = Invoke-RestMethod -Uri $endpoint -Method Post `
        -Body ([System.Text.Encoding]::UTF8.GetBytes($body)) `
        -ContentType 'text/plain' -TimeoutSec 20
} catch {
    Write-Host "  [WARN] 百度推送请求失败: $($_.Exception.Message)" -ForegroundColor Yellow
    exit 0
}

try {
    [System.IO.File]::WriteAllText($lastRespFile, ($resp | ConvertTo-Json -Depth 5), (New-Object System.Text.UTF8Encoding($false)))
} catch { }

if ($null -ne $resp.success) {
    Write-Host ("  [OK] 百度推送成功: 提交 {0} 条，今日剩余配额 {1}" -f $resp.success, $resp.remain) -ForegroundColor Green
    if ($resp.not_same_site -and $resp.not_same_site.Count -gt 0) {
        Write-Host ("       [注意] {0} 条因不属于本站被忽略" -f $resp.not_same_site.Count) -ForegroundColor Yellow
    }
    if ($resp.not_valid -and $resp.not_valid.Count -gt 0) {
        Write-Host ("       [注意] {0} 条 URL 不合法被拒绝" -f $resp.not_valid.Count) -ForegroundColor Yellow
    }
    # 只把本次成功受理的 URL 写入状态
    foreach ($u in $pending) {
        if ($current.ContainsKey($u)) { $state[$u] = $current[$u] }
    }
    $sb = New-Object System.Text.StringBuilder
    [void]$sb.Append('{')
    $first = $true
    foreach ($u in $map.Keys) {
        if ($state.ContainsKey($u)) {
            if (-not $first) { [void]$sb.Append(',') }
            [void]$sb.Append('"' + $u + '":"' + $state[$u] + '"')
            $first = $false
        }
    }
    [void]$sb.Append('}')
    [System.IO.File]::WriteAllText($stateFile, $sb.ToString(), (New-Object System.Text.UTF8Encoding($false)))
    Write-Host "  [OK] 已更新 .baidu-pushed.json（内容未变的 URL 下次自动跳过）" -ForegroundColor DarkGray
} elseif ($resp.error) {
    Write-Host ("  [WARN] 百度推送被拒绝: {0} - {1}" -f $resp.error, $resp.message) -ForegroundColor Yellow
    switch ($resp.error) {
        'over quota'         { Write-Host "         今日配额已用完。未推送的 URL 未记录指纹，明天重跑本脚本会自动只补推剩余的。" }
        'token is not valid' { Write-Host "         准入密钥无效，请到百度搜索资源平台重新获取。" }
        'site init fail'     { Write-Host "         站点未验证通过，请先在百度平台完成站点验证。" }
    }
} else {
    Write-Host "  [WARN] 百度推送返回未知结果。" -ForegroundColor Yellow
}

exit 0
