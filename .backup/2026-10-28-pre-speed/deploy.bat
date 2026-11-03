@echo off
setlocal
cd /d "%~dp0"

echo 🔄 同步文件到 public/...

copy /Y index.html public\ >nul
copy /Y partners.html public\ >nul
copy /Y common.min.js public\ >nul
copy /Y script.min.js public\ >nul
copy /Y style.min.css public\ >nul
copy /Y robots.txt public\ >nul
copy /Y sitemap.xml public\ >nul
copy /Y 50b613ee05dd49d9b3168757218fdb28.txt public\ >nul
copy /Y _headers public\ >nul
robocopy images public\images /E /NFL /NDL >nul
robocopy css public\css /E /NFL /NDL >nul
robocopy webfonts public\webfonts /E /NFL /NDL >nul

echo 🚀 部署到 Cloudflare...
npx wrangler deploy

set "RESULT=%ERRORLEVEL%"
echo.
if not "%RESULT%"=="0" (
  echo ==========================================
  echo  Deploy FAILED with exit code %RESULT%
  echo  Read the wrangler error above.
  echo  Common causes: network / DNS, OAuth token expired
  echo  (run: npx wrangler login), or a bad config file.
  echo ==========================================
  pause
  exit /b %RESULT%
)

echo Deploy finished successfully.
echo https://swiftfishlab.cn
pause
exit /b 0
