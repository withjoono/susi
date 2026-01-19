@echo off
echo Starting Susi Backend and Frontend Servers...
echo.

REM Start Backend on port 4001 in new window
start "Susi Backend (Port 4001)" cmd /k "cd /d %~dp0susi-back && set PORT=4001 && npm run start:dev"

REM Wait 3 seconds
timeout /t 3 /nobreak >nul

REM Start Frontend on port 3001 in new window
start "Susi Frontend (Port 3001)" cmd /k "cd /d %~dp0susi-front && npm run dev"

echo.
echo ========================================
echo Servers are starting in separate windows:
echo.
echo Backend:  http://localhost:4001
echo Frontend: http://localhost:3001
echo ========================================
echo.
echo You can close this window.
pause
