# 🚀 로컬 개발 환경 실행 가이드

**생성 날짜**: 2025-11-18
**프로젝트**: Hizen AI Backend

---

## ⚙️ **사전 요구사항**

### 필수 소프트웨어
- ✅ **Node.js**: v22.15.1 (설치됨)
- ✅ **pnpm**: 10.6.2 (설치됨)
- ⚠️ **PostgreSQL**: 5432 포트에서 실행 중이어야 함
- ⚠️ **Redis** (선택): 캐싱 사용 시 필요

### 환경 변수 확인
현재 `.env` 파일이 설정되어 있습니다:
- `PORT`: 3005
- `DATABASE_URL`: postgresql://username:password@localhost:5432/database_name
- `NODE_ENV`: development

---

## 📦 **1단계: 의존성 설치**

### 🔴 **문제 발견**: node_modules 불완전

현재 `node_modules`가 존재하지만 일부 패키지가 누락되어 있습니다.

### 해결 방법

#### Option A: 전체 재설치 (권장)
```bash
# 프로젝트 루트로 이동
cd E:\Dev\github\Hizen

# node_modules 삭제
rm -rf node_modules apps/*/node_modules

# 의존성 재설치
pnpm install
```

#### Option B: 개별 설치
```bash
# 백엔드만 설치
cd E:\Dev\github\Hizen\apps\hizen-ai-be
pnpm install

# 프론트엔드 설치
cd E:\Dev\github\Hizen\apps\hizen-ai-back-office
pnpm install
```

---

## 🗄️ **2단계: 데이터베이스 설정**

### PostgreSQL 확인
```bash
# PostgreSQL 서비스 확인 (Windows)
sc query postgresql-x64-16

# 또는 직접 연결 테스트
psql -U username -h localhost -p 5432
```

### 데이터베이스 생성
```sql
-- PostgreSQL에 접속 후
CREATE DATABASE database_name;
```

### Prisma 마이그레이션 실행
```bash
cd E:\Dev\github\Hizen\apps\hizen-ai-be

# Prisma 클라이언트 생성
pnpm prisma:generate

# 마이그레이션 실행
npx prisma migrate dev --name init
```

---

## 🖥️ **3단계: 백엔드 서버 실행**

### 실행 명령
```bash
cd E:\Dev\github\Hizen\apps\hizen-ai-be

# 개발 모드 실행
pnpm start:dev
```

### 예상 출력
```
[Nest] 12345  - 2025/11/18, 10:00:00 PM     LOG [NestFactory] Starting Nest application...
[Nest] 12345  - 2025/11/18, 10:00:00 PM     LOG [InstanceLoader] AppModule dependencies initialized
[Nest] 12345  - 2025/11/18, 10:00:01 PM     LOG [RoutesResolver] AuthController {/user_sessions}: +2ms
[Nest] 12345  - 2025/11/18, 10:00:01 PM     LOG [RouterExplorer] Mapped {/health, GET} route
[Nest] 12345  - 2025/11/18, 10:00:01 PM     LOG [NestApplication] Nest application successfully started +5ms
```

### 서버 확인
```bash
# 헬스체크
curl http://localhost:3005/_health

# 또는 브라우저에서
# http://localhost:3005/_health
```

### Swagger API 문서
```
http://localhost:3005/api-docs
```

---

## 🎨 **4단계: 프론트엔드 서버 실행**

### 실행 명령 (새 터미널)
```bash
cd E:\Dev\github\Hizen\apps\hizen-ai-back-office

# 개발 서버 실행
pnpm dev
```

### 예상 출력
```
  VITE v4.4.7  ready in 1234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

### 접속
```
http://localhost:5173
```

---

## 🔍 **트러블슈팅**

### 문제 1: "Cannot find module '@nestjs/cli'"
**원인**: 의존성이 제대로 설치되지 않음

**해결**:
```bash
cd E:\Dev\github\Hizen
pnpm install --force
```

---

### 문제 2: "Error: P1001: Can't reach database server"
**원인**: PostgreSQL이 실행 중이지 않거나 `.env`의 `DATABASE_URL`이 잘못됨

**해결**:
```bash
# 1. PostgreSQL 서비스 시작
net start postgresql-x64-16

# 2. .env 파일 수정
DATABASE_URL="postgresql://your_username:your_password@localhost:5432/your_database"
```

---

### 문제 3: "Port 3005 already in use"
**원인**: 포트가 이미 사용 중

**해결**:
```bash
# Windows에서 프로세스 찾기
netstat -ano | findstr :3005

# 프로세스 종료
taskkill /PID <PID> /F

# 또는 .env에서 다른 포트 사용
PORT=3006
```

---

### 문제 4: Prisma 마이그레이션 오류
**원인**: 데이터베이스 스키마가 동기화되지 않음

**해결**:
```bash
cd E:\Dev\github\Hizen\apps\hizen-ai-be

# Prisma 스튜디오로 DB 확인
npx prisma studio

# 마이그레이션 재실행
npx prisma migrate reset
npx prisma migrate dev
```

---

## 📊 **서버 상태 확인**

### 백엔드 서버
```bash
# 헬스체크 엔드포인트
curl http://localhost:3005/_health

# 응답 예시
{
  "status": "ok",
  "info": { "database": { "status": "up" } }
}
```

### 프론트엔드 서버
```bash
# 브라우저에서 접속
http://localhost:5173

# 또는 터미널에서
curl http://localhost:5173
```

---

## 🎯 **개발 워크플로우**

### 1. 매일 작업 시작
```bash
# PostgreSQL 서비스 확인
sc query postgresql-x64-16

# 백엔드 실행 (터미널 1)
cd E:\Dev\github\Hizen\apps\hizen-ai-be
pnpm start:dev

# 프론트엔드 실행 (터미널 2)
cd E:\Dev\github\Hizen\apps\hizen-ai-back-office
pnpm dev
```

### 2. API 테스트
```bash
# Swagger UI 사용
http://localhost:3005/api-docs

# 또는 Postman, Insomnia 사용
```

### 3. 데이터베이스 관리
```bash
# Prisma Studio 실행
cd E:\Dev\github\Hizen\apps\hizen-ai-be
npx prisma studio

# 브라우저 자동 실행: http://localhost:5555
```

---

## 🔧 **유용한 스크립트**

### 전체 빌드
```bash
cd E:\Dev\github\Hizen
pnpm build
```

### 테스트 실행
```bash
cd E:\Dev\github\Hizen\apps\hizen-ai-be
pnpm test
```

### Lint 및 포맷팅
```bash
cd E:\Dev\github\Hizen\apps\hizen-ai-be
pnpm lint
pnpm format
```

### API SDK 재생성
```bash
cd E:\Dev\github\Hizen\apps\hizen-ai-be
nestia sdk
```

---

## 📝 **환경 변수 설정 가이드**

### 필수 환경 변수
```env
# .env 파일 (apps/hizen-ai-be/.env)

# 서버 설정
NODE_ENV=development
PORT=3005
CORS_ORIGIN=http://localhost:5173

# 데이터베이스 (실제 값으로 변경 필요)
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
DATABASE_ENCRYPTION_KEY=ASNFZ4mrze8BI0VniavN7wEjRWeJq83vASNFZ4mrze8

# 테스트 관리자 계정
TEST_ADMIN_EMAIL=admin@example.com
TEST_ADMIN_USERNAME=admin
TEST_ADMIN_PASSWORD=your_password

# OpenAI API (실제 키 필요)
OPENAI_API_KEY=sk-...

# AWS S3 (실제 값 필요)
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=ap-northeast-2
AWS_S3_BUCKET_NAME=your_bucket_name
```

---

## 🌐 **접속 URL 요약**

| 서비스 | URL | 설명 |
|--------|-----|------|
| **백엔드 API** | http://localhost:3005 | NestJS 서버 |
| **Swagger 문서** | http://localhost:3005/api-docs | API 문서 |
| **헬스체크** | http://localhost:3005/_health | 서버 상태 |
| **프론트엔드** | http://localhost:5173 | React 앱 |
| **Prisma Studio** | http://localhost:5555 | DB 관리 도구 |

---

## ❓ **자주 묻는 질문 (FAQ)**

### Q1: pnpm install이 멈춰있어요
**A**: `Ctrl+C`로 중단 후 `pnpm install --no-frozen-lockfile` 실행

### Q2: 백엔드와 프론트엔드를 동시에 실행할 수 있나요?
**A**: 네! 터미널을 2개 열어서 각각 실행하면 됩니다.

### Q3: 데이터베이스 초기 데이터는 어떻게 넣나요?
**A**: Prisma Studio를 사용하거나 seed 스크립트를 작성하세요.

### Q4: hot-reload가 작동하지 않아요
**A**: 백엔드는 `--watch` 플래그가 활성화되어 있고, 프론트엔드는 Vite가 자동으로 처리합니다.

---

## 🆘 **도움이 필요하신가요?**

1. **프로젝트 문서 확인**:
   - `PROJECT_CONTEXT.md` - 프로젝트 구조
   - `CODE_ANALYSIS_REPORT.md` - 코드 분석

2. **로그 확인**:
   - 백엔드: 터미널 출력 확인
   - 프론트엔드: 브라우저 개발자 도구 (F12)

3. **GitHub Issues**: 문제가 지속되면 이슈 등록

---

**행운을 빕니다! 🎉**
