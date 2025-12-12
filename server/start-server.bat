@echo off
title Bestseller Server
cd /d "%~dp0"
echo Starting Bestseller Server...
echo.
echo Server will keep running. Press Ctrl+C to stop.
echo Close this window to stop the server.
echo.
:loop
node index.js
if errorlevel 1 (
    echo.
    echo Server stopped with an error. Restarting in 5 seconds...
    timeout /t 5 /nobreak >nul
    goto loop
)
pause

