@echo off
setlocal
cd /d "%~dp0"

echo ==========================================
echo  SwiftFishLab Main Site - Deploy (Vercel)
echo ==========================================
echo.

rem [NET] Direct access to the Vercel API can be unstable in CN.
rem Detect local proxy on port 7890 (Clash default) and use it if present.
set "HAS_PROXY="
for /f "tokens=*" %%i in ('netstat -ano ^| findstr /C:":7890 " ^| findstr /C:"LISTENING"') do set "HAS_PROXY=1"
if defined HAS_PROXY (
  set "HTTPS_PROXY=http://127.0.0.1:7890"
  set "HTTP_PROXY=http://127.0.0.1:7890"
  echo [NET] Local proxy 127.0.0.1:7890 detected - deploying via proxy.
) else (
  echo [NET] No local proxy found - going direct. If upload fails, start Clash and re-run.
)
echo.

echo [1/3] Syncing files to public\ ...
copy /Y index.html public\  >nul
copy /Y partners.html public\  >nul
copy /Y common.min.js public\  >nul
copy /Y script.min.js public\  >nul
copy /Y style.min.css public\  >nul
copy /Y robots.txt public\  >nul
copy /Y sitemap.xml public\  >nul
copy /Y 50b613ee05dd49d9b3168757218fdb28.txt public\  >nul
copy /Y og-logo.png public\  >nul
robocopy images public\images /E /NFL /NDL /NJH >nul
robocopy css public\css /E /NFL /NDL /NJH >nul
robocopy webfonts public\webfonts /E /NFL /NDL /NJH >nul
echo Sync done.

echo [2/3] Environment check...
where vercel >nul 2>&1
if errorlevel 1 (
  echo [ERROR] vercel command not found. Run once: npm i -g vercel
  pause
  exit /b 1
)

echo [3/3] Deploying to Vercel production (project root = public\)...
pushd public
call vercel --prod --yes --archive=tgz
set "RESULT=%ERRORLEVEL%"
popd

echo.
if "%RESULT%"=="0" (
  echo Deploy finished successfully.
  echo https://www.swiftfishlab.cn
) else (
  echo ==========================================
  echo  Deploy FAILED with exit code %RESULT%
  echo  Common causes:
  echo   1. Not logged in - run: vercel login
  echo   2. Project not linked - run once: vercel link (inside public)
  echo   3. Network issue - check proxy, then retry
  echo ==========================================
)
pause
exit /b %RESULT%
