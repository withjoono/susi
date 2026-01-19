# 수시 프로젝트 설정 가이드

## 🎉 Hubs 프로젝트에서 복사 완료!

Hubs(거북스쿨) 프로젝트를 복사하여 수시 전용 프로젝트를 만들었습니다.
이제 **로그인은 Hubs 프로덕션을 공유**하고, 나머지는 독립적으로 개발할 수 있습니다!

---

## ⚙️ 필수 설정 단계

### 1. 프론트엔드 환경 변수 설정

`susi-front/.env.local` 파일을 생성하세요:

```bash
cd susi-front
```

**`susi-front/.env.local` 파일 내용:**

```env
# Hubs 프로덕션 API (로그인 전용)
VITE_HUBS_API_URL=https://api.geobukschool.com

# 수시 백엔드 API (독립)
VITE_API_URL=http://localhost:4001
VITE_API_BASE_URL=/api-nest

# Firebase (Hubs 프로덕션 설정과 동일하게)
VITE_FIREBASE_API_KEY=여기에_Hubs_프로덕션_Firebase_키_입력
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id

# 환경
VITE_NODE_ENV=development
```

> **중요**: Firebase 설정은 Hubs 프로덕션과 동일하게 입력하세요!

---

### 2. 백엔드 환경 변수 설정

`susi-back/.env` 파일을 생성하세요:

```bash
cd susi-back
```

**`susi-back/.env` 파일 내용:**

```env
# 서버 포트
SERVER_PORT=4001
NODE_ENV=development

# 데이터베이스 (Hubs 프로덕션과 동일)
DB_TYPE=mysql
DB_HOST=여기에_Hubs_DB_호스트_입력
DB_PORT=3306
DB_USER=여기에_Hubs_DB_사용자_입력
DB_PASSWORD=여기에_Hubs_DB_비밀번호_입력
DB_NAME=geobukschool
DB_SYNCHRONIZE=false
DB_LOGGING=false

# ⚠️ 매우 중요: Hubs 프로덕션의 JWT_SECRET과 동일하게!
JWT_SECRET=여기에_Hubs_프로덕션_JWT_SECRET_입력
JWT_ACCESS_TOKEN_EXPIRES_IN=7d
JWT_REFRESH_TOKEN_EXPIRES_IN=30d

# CORS
CORS_ORIGIN=http://localhost:3001

# Firebase Admin (Hubs 프로덕션과 동일)
FIREBASE_PROJECT_ID=여기에_입력
FIREBASE_PRIVATE_KEY="여기에_입력"
FIREBASE_CLIENT_EMAIL=여기에_입력

# Google Cloud Storage
GCS_PROJECT_ID=여기에_입력
GCS_BUCKET_NAME=여기에_입력

# 기타
THROTTLE_TTL=60
THROTTLE_LIMIT=100
```

> **⚠️ 매우 중요**: 
> - `JWT_SECRET`은 Hubs 프로덕션과 **반드시 동일**해야 합니다!
> - 데이터베이스도 Hubs 프로덕션과 **동일**한 DB를 사용합니다!

---

## 🚀 개발 서버 실행

### 1. 의존성 설치

```bash
# 프론트엔드
cd susi-front
npm install

# 백엔드
cd ../susi-back
npm install
```

### 2. 개발 서버 실행

**터미널 1 - 프론트엔드:**
```bash
cd susi-front
npm run dev
```
→ http://localhost:3001

**터미널 2 - 백엔드:**
```bash
cd susi-back
npm run start:dev
```
→ http://localhost:4001
→ API 문서: http://localhost:4001/api/docs

---

## 🔐 로그인 동작 방식

```
사용자가 수시 프론트엔드에서 로그인
    ↓
Hubs 프로덕션 API로 인증 요청
(https://api.geobukschool.com/auth/login)
    ↓
JWT 토큰 발급 받음
    ↓
이후 수시 API는 수시 백엔드 사용
(http://localhost:4001/api-nest/*)
```

**로그인은 Hubs 프로덕션을 사용하므로 별도의 Hubs 백엔드 실행 불필요!**

---

## 📁 주요 변경사항

### 프론트엔드
- ✅ 포트: `3000` → `3001`
- ✅ 로그인 API: Hubs 프로덕션 사용 (`https://api.geobukschool.com`)
- ✅ 수시 API: 독립 백엔드 사용 (`http://localhost:4001`)

### 백엔드
- ✅ 포트: `4000` → `4001`
- ✅ JWT 인증: Hubs 프로덕션과 동일한 시크릿 사용
- ✅ 데이터베이스: Hubs 프로덕션과 공유

---

## 🎯 개발 시작!

이제 준비가 완료되었습니다!

### 다음 작업:
1. 불필요한 모듈/라우트 제거 (정시, 논술 등)
2. 수시 전용 기능만 남기기
3. UI/UX를 수시에 맞게 수정
4. 독립적으로 개발 진행!

---

## ⚠️ 주의사항

1. **Hubs 프로덕션 코드는 절대 수정하지 마세요!**
   - `E:\Dev\github\GB-Front` (건드리지 말 것)
   - `E:\Dev\github\GB-Back-Nest` (건드리지 말 것)

2. **JWT_SECRET 동일 유지 필수**
   - Hubs에서 발급받은 토큰을 수시 백엔드에서도 검증해야 함

3. **데이터베이스 공유**
   - member_tb, university 등 공통 테이블 사용
   - 데이터 변경 시 Hubs에도 영향 있음 (주의!)

---

## 📚 추가 문서

- [README.md](./README.md) - 프로젝트 개요
- [ARCHITECTURE.md](./ARCHITECTURE.md) - 아키텍처 설명

---

**행운을 빕니다! 🚀**

















