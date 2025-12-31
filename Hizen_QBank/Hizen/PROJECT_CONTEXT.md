# 📊 **Hizen AI Backend - 프로젝트 컨텍스트 맵**

## 🎯 **프로젝트 개요**

**프로젝트명**: Hizen AI Backend
**버전**: 0.1.0
**패키지 매니저**: pnpm@10.6.2
**저장소**: https://github.com/withjoono/hizen-ai-be.git
**런타임**: Node.js v22.15.1, npm 10.9.2

---

## 📁 **프로젝트 구조**

### **Monorepo 아키텍처** (pnpm workspace)

```
Hizen/
├── apps/
│   ├── hizen-ai-be/              # 메인 NestJS 백엔드 서버
│   │   ├── src/                  # 애플리케이션 소스
│   │   ├── prisma/               # 데이터베이스 스키마 & 마이그레이션
│   │   └── packages/api/         # SDK 패키지 (Nestia 자동 생성)
│   ├── hizen-ai-fe/              # 프론트엔드 애플리케이션 (초기 단계)
│   ├── hizen-ai-back-office/     # 관리자 대시보드 (TailAdmin React)
│   └── database-encryption-key-generator/  # DB 암호화 키 생성 도구
└── package.json                  # 루트 워크스페이스 설정
```

---

## 🏗️ **백엔드 아키텍처 (hizen-ai-be)**

### **기술 스택**

**프레임워크**: NestJS 11.x
**데이터베이스**: PostgreSQL (Prisma ORM 6.7.0)
**API 문서화**: Nestia 7.0.0 (자동 SDK 생성 & OpenAPI 3.1)
**타입 검증**: Typia 9.2.0 (런타임 타입 체크)
**인증**: JWT (jsonwebtoken) + Argon2 (비밀번호 해싱)
**AI 통합**: OpenAI API v5
**스토리지**: AWS S3 (파일 업로드)

### **핵심 모듈**

| 모듈 | 기능 | 파일 위치 |
|------|------|-----------|
| **AuthModule** | 인증/인가, JWT 토큰 관리 | src/auth/ |
| **UserModule** | 사용자 관리 (학생/교사/관리자) | src/user/ |
| **ChatSessionModule** | AI 채팅 세션 관리 | src/chat-session/ |
| **ChatSessionSseModule** | SSE 실시간 스트리밍 | src/chat-session/ |
| **QuestionModule** | 문제 관리 & 라벨링 | src/question/ |
| **DocumentModule** | 문서 처리 | src/document/ |
| **FileModule** | 파일 업로드/다운로드 (S3) | src/file/ |
| **AgentModule** | AI 에이전트 로직 | src/agent/ |
| **CryptoModule** | 암호화 서비스 | src/crypto/ |
| **DbModule** | Prisma DB 연결 관리 | src/db/ |
| **HealthModule** | 헬스체크 엔드포인트 | src/health/ |

---

## 🗄️ **데이터베이스 스키마**

### **주요 엔티티**

**User** (사용자)
- 역할: ADMIN, TEACHER, STUDENT
- 인증: username, passwordHash (Argon2)
- 관계: UserSession (1:N)

**Question** (문제)
- htmlQuestionContent: HTML 형식 문제
- htmlSolutionContent: HTML 형식 풀이
- answer: 정답
- selections: 선택지 배열
- 관계: QuestionImage (1:N), QuestionLabelPair (1:N)

**ChatSession** (채팅 세션)
- AI 채팅 대화 관리
- eventCount, messageCount 추적
- htmlQuestionContent, htmlSolutionContent 저장

**QuestionLabel** (문제 라벨)
- 문제 분류/태깅 시스템
- Many-to-Many → QuestionLabelPair

**UploadedFile** (업로드 파일)
- S3 연동 파일 메타데이터 관리

---

## ⚙️ **주요 설정**

### **TypeScript 설정** (tsconfig.json)

```json
{
  "target": "ES2023",
  "module": "commonjs",
  "strictNullChecks": true,
  "experimentalDecorators": true,
  "emitDecoratorMetadata": true,
  "paths": {
    "@app/*": ["src/*"],
    "@api/*": ["src/api/*"],
    "prisma/prisma-generated": ["prisma/prisma-generated"]
  },
  "plugins": [
    "typia/lib/transform",
    "@nestia/core/lib/transform",
    "typescript-transform-paths",
    "@nestia/sdk/lib/transform"
  ]
}
```

### **Nestia 설정** (nestia.config.ts)

```typescript
{
  input: SdkModule,
  output: "src/api",           // 생성된 API 타입
  distribute: "packages/api",  // SDK 패키지 배포
  swagger: {
    openapi: "3.1",
    output: "./src/swagger.json",
    servers: [
      { url: "http://localhost:3000", description: "local" },
      { url: "http://15.164.222.104", description: "development" }
    ]
  }
}
```

### **환경 변수** (.env.example)

```env
NODE_ENV=development
PORT=3000
CORS_ORIGIN=*

DATABASE_URL=postgresql://...
DATABASE_ENCRYPTION_KEY=...

TEST_ADMIN_EMAIL=test-admin@example.com
TEST_ADMIN_USERNAME=test-admin
TEST_ADMIN_PASSWORD=1234

OPENAI_API_KEY=your-openai-api-key

AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=...
AWS_S3_BUCKET_NAME=...
```

---

## 🚀 **빌드 & 실행**

### **주요 스크립트**

```bash
# 전체 프로젝트 빌드
pnpm build

# 병렬 빌드 (각 앱별)
pnpm build:parallel

# 백엔드 개발 서버
cd apps/hizen-ai-be && pnpm start:dev

# Prisma 마이그레이션
cd apps/hizen-ai-be && pnpm prisma:generate

# API SDK 생성
cd apps/hizen-ai-be && nestia sdk

# DB 암호화 키 생성
pnpm generate:db-encryption-key

# 관리자 대시보드
cd apps/hizen-ai-back-office && pnpm dev
```

---

## 🎨 **프론트엔드 (hizen-ai-back-office)**

**프레임워크**: React 18.2 + Vite 4.4.7
**UI 라이브러리**: TailwindCSS 3.3.3, Material Tailwind 2.1.9
**리치 텍스트**: Lexical 0.31.0, TipTap 2.11.9
**데이터 시각화**: ApexCharts, D3.js
**기타**: React Router 6.14.2, Axios, Firebase 10.11.0

### **주요 기능**
- 관리자 대시보드
- 문제 편집기 (Lexical/TipTap)
- 차트 및 통계 시각화
- PDF 처리 (pdfjs-dist)
- OCR (Tesseract.js)

---

## 🔒 **보안 & 인증**

- **비밀번호 해싱**: Argon2
- **JWT 토큰**: Bearer 인증
- **DB 암호화**: 전용 암호화 키 사용
- **CORS**: 환경변수로 제어
- **테스트 계정**: 개발 환경에서만 활성화

---

## 📦 **의존성 요약**

### **백엔드 핵심 의존성**
- `@nestjs/*`: 11.x (NestJS 프레임워크)
- `@nestia/*`: 6.0.3 (API SDK 자동 생성)
- `@prisma/client`: 6.7.0 (ORM)
- `typia`: 9.2.0 (런타임 타입 검증)
- `openai`: ^5 (OpenAI API)
- `argon2`: 0.43.0 (비밀번호 해싱)
- `jsonwebtoken`: 9.0.2 (JWT)
- `@aws-sdk/client-s3`: 3.840.0 (S3 연동)

### **프론트엔드 핵심 의존성**
- `react`: 18.2.0
- `@lexical/react`: 0.31.0 (리치 텍스트 에디터)
- `@tiptap/react`: 2.11.9 (대체 에디터)
- `apexcharts`: 3.41.0 (차트)
- `firebase`: 10.11.0
- `openai`: 4.87.3 (프론트엔드 AI 연동)

---

## 🔄 **최근 커밋 이력**

```
0a6ce99 feat: add Prisma generate to build process for Firebase App Hosting
b5d5e57 fix: resolve build issues and rename project to hizen-ai-backend
f681bd7 fix: branch name
169095e temp: test deploy again
0708acc fix: deploy
```

---

## 🎯 **프로젝트 목표**

**AI 기반 교육 플랫폼** 개발
- 학생/교사/관리자 역할 기반 시스템
- AI 채팅을 통한 문제 풀이 지원
- 문제 관리 및 라벨링 시스템
- 실시간 스트리밍 응답 (SSE)
- 파일 업로드 및 문서 처리

---

**생성 날짜**: 2025-11-18
**생성 도구**: Claude Code - /sc:load 명령
