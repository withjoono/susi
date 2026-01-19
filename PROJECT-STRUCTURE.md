# 전체 프로젝트 구조

```
Susi/
│
├── README.md                    # 프로젝트 개요
├── DEVELOPMENT-GUIDE.md         # 개발 가이드
├── ARCHITECTURE.md              # 아키텍처 문서
├── DEPLOYMENT-GUIDE.md          # 배포 가이드
├── GIT-SETUP.md                # Git 설정
│
├── susi-front/                  # 수시 프론트엔드
│   ├── src/
│   │   ├── routes/             # 페이지 라우트
│   │   │   ├── __root.tsx
│   │   │   └── index.tsx
│   │   ├── components/         # 컴포넌트
│   │   ├── lib/               # 라이브러리
│   │   │   ├── api-client.ts  # API 클라이언트
│   │   │   ├── config.ts      # 설정
│   │   │   └── utils.ts       # 유틸리티
│   │   ├── stores/            # 상태 관리 (Zustand)
│   │   ├── hooks/             # 커스텀 훅
│   │   ├── types/             # 타입 정의
│   │   ├── assets/            # 정적 파일
│   │   ├── index.css          # 글로벌 스타일
│   │   ├── main.tsx           # 엔트리 포인트
│   │   └── routeTree.gen.ts   # 라우트 트리 (자동 생성)
│   ├── public/                # 정적 리소스
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── postcss.config.cjs
│   ├── .eslintrc.cjs
│   ├── .prettierrc
│   ├── .gitignore
│   ├── .env.example
│   └── README.md
│
├── susi-back/                   # 수시 백엔드
│   ├── src/
│   │   ├── config/             # 설정
│   │   │   └── database.config.ts
│   │   ├── common/             # 공통 모듈
│   │   ├── modules/            # 기능 모듈
│   │   │   └── susi/
│   │   │       ├── susi.module.ts
│   │   │       ├── susi.controller.ts
│   │   │       └── susi.service.ts
│   │   ├── database/           # 데이터베이스
│   │   ├── app.module.ts       # 루트 모듈
│   │   ├── app.controller.ts
│   │   ├── app.service.ts
│   │   └── main.ts             # 엔트리 포인트
│   ├── package.json
│   ├── nest-cli.json
│   ├── tsconfig.json
│   ├── tsconfig.build.json
│   ├── .eslintrc.js
│   ├── .prettierrc
│   ├── .gitignore
│   ├── .env.example
│   └── README.md
│
└── shared-packages/             # 공유 패키지
    ├── auth/                    # 인증 관련
    │   ├── index.ts            # 로그인, 로그아웃
    │   └── api-client.ts       # Hubs API 클라이언트
    ├── ui/                     # UI 컴포넌트
    │   ├── Button.tsx
    │   └── index.ts
    ├── types/                  # 공통 타입
    │   └── index.ts
    ├── utils/                  # 유틸리티
    │   └── index.ts
    ├── package.json
    └── README.md
```

## 파일별 설명

### 프론트엔드 핵심 파일

- **main.tsx**: React 앱 초기화, TanStack Router 및 Query 설정
- **vite.config.ts**: Vite 설정, alias 및 proxy 설정
- **api-client.ts**: Axios 클라이언트, 인터셉터 설정
- **index.css**: TailwindCSS 설정, 글로벌 스타일

### 백엔드 핵심 파일

- **main.ts**: NestJS 앱 부트스트랩, Swagger 설정
- **app.module.ts**: 루트 모듈, 모든 모듈 임포트
- **database.config.ts**: TypeORM 데이터베이스 설정

### 공유 패키지 핵심 파일

- **auth/index.ts**: 로그인, 로그아웃 함수
- **types/index.ts**: API 응답, 에러 타입 정의
- **utils/index.ts**: 날짜, 숫자 포맷팅 함수

## 다음 단계

프로젝트 구조가 완성되었습니다!

이제 다음 작업을 진행할 수 있습니다:

1. **의존성 설치**
   ```bash
   cd susi-front && npm install
   cd ../susi-back && npm install
   ```

2. **환경 변수 설정**
   - DEVELOPMENT-GUIDE.md 참조

3. **개발 서버 실행**
   - DEVELOPMENT-GUIDE.md 참조

4. **수시 API 구현**
   - 5단계 수시 교과 API
   - 수시 학종 API

5. **UI 컴포넌트 개발**
   - 수시 전용 UI 컴포넌트
   - 5단계 흐름 UI


















