@echo off
chcp 65001 > nul
echo ========================================
echo 🛑 Susi 개발 서버 중지
echo ========================================

echo.
echo Node.js 프로세스 종료 중...

REM 포트를 사용하는 프로세스 찾기
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001 ^| findstr LISTENING') do (
    echo    프론트엔드 서버 (PID: %%a) 종료 중...
    taskkill /F /PID %%a > nul 2>&1
)

for /f "tokens=5" %%a in ('netstat -ano ^| findstr :4001 ^| findstr LISTENING') do (
    echo    백엔드 서버 (PID: %%a) 종료 중...
    taskkill /F /PID %%a > nul 2>&1
)

echo.
echo ✅ 서버 중지 완료
echo.
echo 💡 Docker 컨테이너는 계속 실행됩니다.
echo    컨테이너도 중지하려면 다음 명령을 실행하세요:
echo    docker stop geobuk-postgres geobuk-redis
echo.
pause
