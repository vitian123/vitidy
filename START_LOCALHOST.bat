@echo off
title VITidy Localhost Launcher
color 0F
cls
echo ============================================================
echo           VITidy - Student & Hostel Cleaning Portal
echo                     Localhost Launcher
echo ============================================================
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [!] Node.js was not detected on this system.
    echo [*] Launching instant standalone browser edition instead...
    echo.
    start "" "VITidy_Preview.html"
    echo Opened VITidy_Preview.html in your default browser.
    echo (Install Node.js from https://nodejs.org to run the full dev server)
    echo.
    pause
    exit /b
)

:: Check if node_modules exists, install if missing
if not exist "node_modules\" (
    echo [*] First-time setup detected: Installing required packages...
    echo [*] Running 'npm install' (this takes ~15-30 seconds)...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [X] 'npm install' encountered an issue. Falling back to browser preview...
        start "" "VITidy_Preview.html"
        pause
        exit /b
    )
    echo [*] Packages installed successfully!
    echo.
)

:: Start the Backend and Frontend servers
echo [*] Starting VITidy Backend Service on port 5000...
start "VITidy Backend" /min cmd.exe /c "node server/index.js"

echo [*] Starting Vite development server on localhost...
echo [*] Your default browser will open automatically at http://localhost:5180
echo [*] Press Ctrl+C in this window anytime to stop the server.
echo.
call npm run dev

pause
