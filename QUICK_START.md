# 🚀 Susi 빠른 시작 가이드

## 최초 설정 (1회만)

### 1. 필수 프로그램 설치
- [x] Node.js 18+ 설치
- [x] Docker Desktop 설치 및 실행

### 2. 의존성 설치
```bash
# 프론트엔드 의존성 설치
cd susi-front
npm install

# 백엔드 의존성 설치
cd ../susi-back
npm install
```

### 3. 환경 변수 설정
백엔드 환경 변수는 이미 설정되어 있습니다:
- ✅ `susi-back/.env.development` (개발 환경)
- ✅ `susi-back/.env.local` (개인 설정, git ignore)

## 🎯 서버 실행 (30초)

### 방법 1: 빠른 시작 스크립트 (권장) ⭐
프로젝트 루트에서:
```bash
start-dev.bat
```

이 스크립트가 자동으로:
1. Docker 컨테이너 상태 확인
2. PostgreSQL 컨테이너 시작
3. Redis 컨테이너 시작
4. 백엔드 서버 시작 (포트 4001)
5. 프론트엔드 서버 시작 (포트 3001)

### 방법 2: 수동 실행
```bash
# 1. Docker 컨테이너 시작
docker start geobuk-postgres geobuk-redis

# 2. 백엔드 서버 시작
cd susi-back
npm run start:dev

# 3. 새 터미널에서 프론트엔드 시작
cd susi-front
npm run dev
```

## 📊 상태 확인

### 실시간 상태 확인
```bash
check-status.bat
```

### 수동 확인
```bash
# Docker 컨테이너 상태
docker ps

# 포트 사용 확인
netstat -an | findstr ":3001"  # 프론트엔드
netstat -an | findstr ":4001"  # 백엔드
```

## 🛑 서버 중지

### 방법 1: 빠른 중지 스크립트
```bash
stop-dev.bat
```

### 방법 2: 수동 중지
- 각 터미널 창에서 `Ctrl + C` 누르기

## 🌐 접속 정보

| 서비스 | URL | 설명 |
|--------|-----|------|
| 프론트엔드 | http://localhost:3001 | React + Vite 앱 |
| 백엔드 API | http://localhost:4001 | NestJS REST API |
| API 문서 | http://localhost:4001/swagger | Swagger UI |

## 🔧 문제 해결

### Docker 컨테이너가 시작되지 않는 경우
```bash
# Docker Desktop이 실행 중인지 확인
docker ps

# 컨테이너 재생성 (필요시)
docker run --name geobuk-postgres -e POSTGRES_PASSWORD=tsuser1234 -e POSTGRES_USER=tsuser -e POSTGRES_DB=geobukschool_dev -p 5432:5432 -d postgres:14

docker run --name geobuk-redis -p 6379:6379 -d redis:7-alpine
```

### 포트 충돌 발생 시
```bash
# 포트 사용 중인 프로세스 확인
netstat -ano | findstr ":3001"
netstat -ano | findstr ":4001"

# 프로세스 종료 (PID 확인 후)
taskkill /F /PID [PID번호]
```

### 백엔드 컴파일 오류
```bash
cd susi-back

# dist 폴더 삭제 후 재시작
npm run clean
npm run start:dev
```

### Redis 연결 오류
```bash
# Redis 컨테이너 상태 확인
docker ps -a | findstr redis

# Redis 시작
docker start geobuk-redis

# Redis 로그 확인
docker logs geobuk-redis
```

## 📝 개발 팁

### 자동 재시작 설정됨
- **프론트엔드**: 파일 저장 시 자동 새로고침 (Vite HMR)
- **백엔드**: 파일 저장 시 자동 재컴파일 (NestJS watch mode)

### Docker 자동 시작 설정됨
Docker 컨테이너는 `restart: unless-stopped` 정책이 적용되어 있어:
- Docker Desktop 재시작 시 자동으로 컨테이너가 시작됩니다
- 수동으로 중지하기 전까지 계속 실행됩니다

### 추천 개발 흐름
1. `start-dev.bat` 실행
2. 브라우저에서 http://localhost:3001 열기
3. 코드 수정
4. 자동 새로고침 확인
5. 작업 완료 후 터미널에서 `Ctrl+C`

## 📚 추가 문서

- [서버 실행 지연 원인 분석](./SERVER_STARTUP_ANALYSIS.md)
- [프로젝트 구조](./PROJECT-STRUCTURE.md)
- [개발 가이드](./DEVELOPMENT-GUIDE.md)

## ⚡ 성능 지표

### 정상 실행 시간
- Docker 컨테이너 시작: **5초**
- 백엔드 컴파일 + 시작: **30-60초**
- 프론트엔드 시작: **10-20초**
- **총 예상 시간: 1-2분 이내** ✅

### 문제가 있다면
서버 실행이 2분 이상 소요되거나 오류가 발생하면:
1. `check-status.bat`으로 상태 확인
2. [SERVER_STARTUP_ANALYSIS.md](./SERVER_STARTUP_ANALYSIS.md) 참고
3. 문제 해결 섹션 확인
