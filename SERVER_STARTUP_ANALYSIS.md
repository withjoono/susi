# 서버 실행 지연 원인 분석 및 해결 방안

## 📊 실행 시간 분석

### 실제 소요 시간
- **총 소요 시간**: 약 10분
- **정상 실행 시간**: 약 1-2분 (예상)
- **지연 시간**: 약 8-9분

## 🔍 지연 원인 분석

### 1. 환경 변수 파일 불일치 (주요 원인)
**문제점:**
- `susi-back/.env` 파일: `SERVER_PORT=4002`
- `susi-back/.env.development` 파일: `PORT=4001`
- 사용자 요구사항: 포트 4001

**영향:**
- 잘못된 포트로 서버 시작 시도
- 수동으로 .env 파일 수정 필요
- 재시작 필요

**근본 원인:**
```
NODE_ENV=development일 때:
1. .env.development 파일이 우선 로드됨
2. 하지만 .env 파일도 함께 읽혀서 충돌 가능
3. 어떤 값이 우선되는지 명확하지 않음
```

### 2. Redis 컨테이너 미실행 (치명적 오류)
**문제점:**
- Redis 컨테이너 `geobuk-redis`가 중지 상태였음
- 백엔드가 Redis 연결 실패로 시작 불가

**에러 로그:**
```
Redis Connection Error: AggregateError [ECONNREFUSED]
[31m[Nest] 28236 - ERROR[39m [ExceptionHandler]
AggregateError [ECONNREFUSED]
```

**영향:**
- 백엔드 서버 완전 중단
- Redis 컨테이너 수동 시작 필요
- 서버 재시작 필요

### 3. Docker 컨테이너 자동 시작 미설정
**문제점:**
- PostgreSQL 컨테이너: `prestart:dev` 스크립트로 자동 시작 ✅
- Redis 컨테이너: 자동 시작 설정 없음 ❌

**현재 상태:**
```bash
# package.json에서
"prestart:dev": "npm run docker:start"
"docker:start": "docker start geobuk-postgres 2>nul || echo Docker container not found"
```

Redis는 포함되지 않음!

### 4. TypeScript 컴파일 시간
**소요 시간:**
- 첫 컴파일: 약 2분 4초 (7:48:37 → 7:50:41)
- 두 번째 컴파일: 약 52초 (7:57:42 → 7:58:34)

**영향:**
- 서버가 컴파일 완료 후에야 시작됨
- 대기 시간 발생

## ✅ 해결 방안

### 즉시 적용 가능한 해결책

#### 1. 환경 변수 정리
**권장 사항:**
- `.env` 파일 삭제 또는 `.env.example`로 변경
- `.env.development`만 사용 (개발 환경)
- `.env.production`은 프로덕션 전용

#### 2. Redis 자동 시작 추가
**수정할 파일:** `susi-back/package.json`

현재:
```json
"docker:start": "docker start geobuk-postgres 2>nul || echo Docker container not found"
```

수정 후:
```json
"docker:start": "docker start geobuk-postgres geobuk-redis 2>nul || echo Docker containers starting..."
```

#### 3. Docker 컨테이너 restart 정책 설정
```bash
# geobuk-postgres 자동 재시작 설정
docker update --restart unless-stopped geobuk-postgres

# geobuk-redis 자동 재시작 설정
docker update --restart unless-stopped geobuk-redis
```

이렇게 하면 Docker Desktop 시작 시 자동으로 컨테이너 실행됨.

### 4. 빠른 실행 스크립트 생성

#### Windows용 시작 스크립트 (start-dev.bat)
```batch
@echo off
echo ========================================
echo Susi 개발 서버 시작
echo ========================================

echo.
echo [1/4] Docker 컨테이너 확인 중...
docker ps -q --filter "name=geobuk-postgres" > nul 2>&1
if %errorlevel% neq 0 (
    echo PostgreSQL 컨테이너 시작 중...
    docker start geobuk-postgres
)

docker ps -q --filter "name=geobuk-redis" > nul 2>&1
if %errorlevel% neq 0 (
    echo Redis 컨테이너 시작 중...
    docker start geobuk-redis
)

echo.
echo [2/4] 컨테이너 Ready 대기 중 (5초)...
timeout /t 5 /nobreak > nul

echo.
echo [3/4] 백엔드 서버 시작 중 (포트 4001)...
start "Susi Backend" cmd /k "cd susi-back && npm run start:dev"

echo.
echo [4/4] 프론트엔드 서버 시작 중 (포트 3001)...
timeout /t 3 /nobreak > nul
start "Susi Frontend" cmd /k "cd susi-front && npm run dev"

echo.
echo ========================================
echo 서버 시작 완료!
echo ========================================
echo Frontend: http://localhost:3001
echo Backend:  http://localhost:4001
echo Swagger:  http://localhost:4001/swagger
echo.
pause
```

## 📝 체크리스트

### 서버 실행 전 확인사항
```
□ Docker Desktop 실행 중인가?
□ geobuk-postgres 컨테이너 Running 상태인가?
□ geobuk-redis 컨테이너 Running 상태인가?
□ .env.development 파일 존재하는가?
□ .env 파일이 .env.development와 충돌하지 않는가?
□ node_modules 설치되어 있는가?
```

### 문제 발생 시 체크리스트
```
1. 백엔드가 시작 안 됨
   → Redis 컨테이너 상태 확인: docker ps -a | findstr redis
   → Redis 시작: docker start geobuk-redis

2. 포트 충돌
   → 사용 중인 프로세스 확인: netstat -ano | findstr ":4001"
   → 프로세스 종료: taskkill /F /PID [PID번호]

3. 컴파일 오류
   → dist 폴더 삭제: cd susi-back && rm -rf dist
   → node_modules 재설치: npm install

4. 환경 변수 문제
   → .env 파일 확인
   → NODE_ENV 확인: echo %NODE_ENV%
```

## 🚀 권장 실행 순서

### 최적의 실행 순서 (30초 이내)
```bash
# 1. Docker 컨테이너 시작 (5초)
docker start geobuk-postgres geobuk-redis

# 2. 백엔드 먼저 시작 (백그라운드)
cd susi-back && start cmd /k "npm run start:dev"

# 3. 프론트엔드 시작 (백그라운드)
cd susi-front && start cmd /k "npm run dev"

# 완료!
```

## 💡 개선 제안

### 단기 개선 (즉시 가능)
1. ✅ `.env` 파일 삭제 또는 이름 변경
2. ✅ `package.json`의 `docker:start` 스크립트에 Redis 추가
3. ✅ Docker 컨테이너 restart 정책 설정
4. ✅ 빠른 시작 스크립트 생성

### 중기 개선 (1-2일)
1. Docker Compose 파일 작성 (모든 서비스 한 번에 관리)
2. 환경 변수 검증 스크립트 추가
3. 헬스 체크 스크립트 추가

### 장기 개선 (1주일)
1. 개발 환경 자동화 (Dev Container)
2. 통합 모니터링 대시보드
3. CI/CD 파이프라인 구축

## 📌 다음 실행 시 참고사항

### 정상 실행 시간 목표
- Docker 컨테이너 시작: **5초**
- 백엔드 컴파일 + 시작: **30-60초**
- 프론트엔드 시작: **10-20초**
- **총 예상 시간: 1-2분 이내**

### 빠른 시작을 위한 팁
1. Docker Desktop을 Windows 시작 시 자동 실행 설정
2. 컨테이너에 `restart: unless-stopped` 정책 적용
3. 빠른 시작 배치 파일 사용
4. IDE에서 Run Configuration 설정하여 한 번에 실행
