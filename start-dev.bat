@echo off
chcp 65001 > nul
echo ========================================
echo 🚀 Susi 개발 서버 시작
echo ========================================

echo.
echo [1/5] Docker 컨테이너 상태 확인 중...
docker ps > nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Desktop이 실행되지 않았습니다.
    echo    Docker Desktop을 먼저 실행해주세요.
    pause
    exit /b 1
)

echo.
echo [2/5] PostgreSQL 컨테이너 확인 중...
docker ps --filter "name=geobuk-postgres" --filter "status=running" | findstr geobuk-postgres > nul
if %errorlevel% neq 0 (
    echo    PostgreSQL 컨테이너 시작 중...
    docker start geobuk-postgres > nul
    if %errorlevel% neq 0 (
        echo    ❌ PostgreSQL 컨테이너 시작 실패
        pause
        exit /b 1
    )
    echo    ✅ PostgreSQL 시작 완료
) else (
    echo    ✅ PostgreSQL 이미 실행 중
)

echo.
echo [3/5] Redis 컨테이너 확인 중...
docker ps --filter "name=geobuk-redis" --filter "status=running" | findstr geobuk-redis > nul
if %errorlevel% neq 0 (
    echo    Redis 컨테이너 시작 중...
    docker start geobuk-redis > nul
    if %errorlevel% neq 0 (
        echo    ❌ Redis 컨테이너 시작 실패
        pause
        exit /b 1
    )
    echo    ✅ Redis 시작 완료
) else (
    echo    ✅ Redis 이미 실행 중
)

echo.
echo [4/5] 컨테이너 Ready 대기 중 (3초)...
timeout /t 3 /nobreak > nul

echo.
echo [5/5] 서버 시작 중...
echo    - 백엔드 서버 (포트 4001)...
start "Susi Backend - Port 4001" cmd /k "cd /d %~dp0susi-back && npm run start:dev"

timeout /t 2 /nobreak > nul

echo    - 프론트엔드 서버 (포트 3001)...
start "Susi Frontend - Port 3001" cmd /k "cd /d %~dp0susi-front && npm run dev"

echo.
echo ========================================
echo ✅ 서버 시작 완료!
echo ========================================
echo.
echo 📌 접속 정보:
echo    Frontend:  http://localhost:3001
echo    Backend:   http://localhost:4001
echo    Swagger:   http://localhost:4001/swagger
echo.
echo 💡 서버가 완전히 시작되기까지 1-2분 정도 소요됩니다.
echo    새로 열린 터미널 창에서 진행 상황을 확인할 수 있습니다.
echo.
echo 🛑 서버를 중지하려면 각 터미널 창에서 Ctrl+C를 누르세요.
echo.
pause
