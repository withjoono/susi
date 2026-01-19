@echo off
chcp 65001 > nul
echo ========================================
echo 📊 Susi 개발 환경 상태 확인
echo ========================================

echo.
echo [Docker 컨테이너]
echo ----------------------------------------
docker ps -a --filter "name=geobuk-postgres" --filter "name=geobuk-redis" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo.
echo [서버 포트 상태]
echo ----------------------------------------
netstat -an | findstr ":3001.*LISTENING" > nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Frontend  - Port 3001: RUNNING
) else (
    echo ❌ Frontend  - Port 3001: STOPPED
)

netstat -an | findstr ":4001.*LISTENING" > nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend   - Port 4001: RUNNING
) else (
    echo ❌ Backend   - Port 4001: STOPPED
)

echo.
echo [Node.js 프로세스]
echo ----------------------------------------
set node_count=0
for /f %%a in ('tasklist /FI "IMAGENAME eq node.exe" ^| find /c "node.exe"') do set node_count=%%a
echo Node.js 프로세스: %node_count%개 실행 중

echo.
echo [접속 URL]
echo ----------------------------------------
echo Frontend:  http://localhost:3001
echo Backend:   http://localhost:4001
echo Swagger:   http://localhost:4001/swagger
echo.
pause
