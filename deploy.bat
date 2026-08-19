@echo off
echo 🔄 同步文件到 public/...

copy /Y index.html public\ >nul
copy /Y contact.html public\ >nul
copy /Y partners.html public\ >nul
copy /Y common.min.js public\ >nul
copy /Y script.min.js public\ >nul
copy /Y style.min.css public\ >nul
copy /Y robots.txt public\ >nul
copy /Y sitemap.xml public\ >nul
copy /Y 50b613ee05dd49d9b3168757218fdb28.txt public\ >nul
robocopy images public\images /E /NFL /NDL >nul
robocopy css public\css /E /NFL /NDL >nul
robocopy webfonts public\webfonts /E /NFL /NDL >nul

echo 🚀 部署到 Cloudflare...
npx wrangler deploy
