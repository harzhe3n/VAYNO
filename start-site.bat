@echo off
rem Double-click to run the VAYNO website. Keep this window open while you use the site.
cd /d "%~dp0"
title VAYNO website server
if not exist node_modules (
    echo Installing packages for the first time...
    call npm install
)
echo.
echo Starting the VAYNO website. Your browser will open http://localhost:3000
echo Keep this window open. Close it to stop the website.
echo.
start "" /b cmd /c "timeout /t 2 /nobreak >nul & start "" http://localhost:3000"
rem --watch restarts the server by itself when server.js changes.
node --watch server.js
echo.
echo The server stopped. If you see an error above, send it to Claude.
pause
