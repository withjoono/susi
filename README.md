# 수시 (Susi) - 독립 개발 프로젝트

> **Hubs 프로젝트에서 복사하여 생성됨**  
> 로그인은 Hubs 프로덕션 공유, 나머지는 독립 개발!

## 📋 프로젝트 개요

수시는 거북스쿨(Hubs) 프로젝트를 복사하여 만든 독립 프로젝트입니다.
**로그인은 Hubs 프로덕션을 공유**하고, 나머지 기능은 독립적으로 개발합니다.

### 프로젝트 구조

```
Susi/
├── susi-front/              # 수시 프론트엔드 (독립)
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
│
├── susi-back/               # 수시 백엔드 (독립)
│   ├── src/
│   ├── package.json
│   └── nest-cli.json
│
├── shared-packages/         # 공유 패키지
│   ├── auth/               # 인증 관련 (Hubs와 공유)
│   ├── ui/                 # UI 컴포넌트 (Hubs와 공유)
│   └── types/              # 공통 타입 정의
│
└── README.md               # 이 파일
```

## 🔗 Hubs 프로젝트와의 관계

### 공유하는 부분
- **로그인/인증**: JWT 토큰 기반 인증 시스템
- **회원 데이터베이스**: member_tb 테이블 공유
- **공통 UI 컴포넌트**: 버튼, 입력폼, 다이얼로그 등
- **공통 타입 정의**: API 응답 타입, 에러 타입 등

### 독립적인 부분
- **수시 전용 비즈니스 로직**: 수시 교과/학종 분석
- **수시 전용 데이터**: susi_subject, susi_comprehensive 등
- **수시 전용 UI/UX**: 5단계 선택 흐름 등
- **배포**: 독립적인 도메인 및 서버

## 🚀 빠른 시작

### ⚠️ 필수: 환경 변수 설정 먼저!

**반드시 [SETUP-GUIDE.md](./SETUP-GUIDE.md)를 먼저 읽고 환경 변수를 설정하세요!**

### Hubs 원본 프로젝트 (절대 수정 금지!)
- **프론트엔드**: `E:\Dev\github\GB-Front`
- **백엔드**: `E:\Dev\github\GB-Back-Nest`
- **프로덕션 API**: `https://api.geobukschool.com`

### 개발 서버 실행

#### 1. 프론트엔드

```bash
cd susi-front
npm install
npm run dev  # http://localhost:3001
```

#### 2. 백엔드

```bash
cd susi-back
npm install
npm run start:dev  # http://localhost:4001
```

#### ✅ Hubs 백엔드는 실행 불필요!
로그인은 Hubs 프로덕션 API를 사용하므로, 별도로 Hubs 백엔드를 실행할 필요가 없습니다.

## 📦 공유 패키지 사용법

### 인증 패키지 사용

```typescript
// susi-front/src/lib/auth.ts
import { loginWithEmail, getCurrentUser } from '@shared/auth';

const user = await loginWithEmail(email, password);
```

### UI 컴포넌트 사용

```typescript
// susi-front/src/components/MyComponent.tsx
import { Button, Dialog } from '@shared/ui';

export function MyComponent() {
  return <Button>클릭</Button>;
}
```

## 🔧 개발 가이드

### 프론트엔드

- **프레임워크**: React 18 + Vite
- **라우팅**: TanStack Router
- **상태관리**: Zustand
- **스타일링**: TailwindCSS + Radix UI
- **API 통신**: Axios + TanStack Query

### 백엔드

- **프레임워크**: NestJS 10
- **ORM**: TypeORM
- **데이터베이스**: MySQL 8
- **인증**: JWT (passport-jwt)
- **API 문서**: Swagger

## 🗄️ 데이터베이스

### Hubs와 공유하는 테이블
- `member_tb`: 회원 정보
- `university`: 대학 마스터 데이터
- `admission*`: 전형 관련 마스터 데이터
- `recruitment_unit*`: 모집단위 마스터 데이터

### 수시 전용 테이블
- `susi_subject`: 수시 교과 전형 데이터
- `susi_comprehensive`: 수시 학종 전형 데이터
- `susi_pass_record`: 합불 사례 데이터
- `member_interests`: 수시 관심사 (수시 전용)

## 🌐 배포

### 자동 배포 (GitHub Actions)

이 프로젝트는 GitHub Actions를 통해 자동으로 배포됩니다.

- **프론트엔드**: `main` 브랜치에 푸시 → Firebase Hosting 자동 배포
- **백엔드**: `main` 브랜치에 푸시 → Cloud Run 자동 배포

#### GitHub Secrets 설정 필요
자동 배포를 활성화하려면 다음 Secrets를 GitHub 저장소에 추가해야 합니다:
1. `FIREBASE_SERVICE_ACCOUNT`: Firebase 배포용 서비스 계정
2. `GCP_SA_KEY`: Cloud Run 배포용 GCP 서비스 계정

자세한 설정 방법은 [.github/GITHUB_SECRETS_SETUP.md](.github/GITHUB_SECRETS_SETUP.md)를 참조하세요.

### 프론트엔드 배포
- **호스팅**: Firebase Hosting
- **프로젝트 ID**: ts-front-479305
- **도메인**: susi.turtleschool.com

### 백엔드 배포
- **호스팅**: Google Cloud Run
- **프로젝트 ID**: ts-back-nest-479305
- **서비스**: susi-backend
- **리전**: asia-northeast3
- **데이터베이스**: Cloud SQL (Hubs와 동일 인스턴스)

### 수동 배포

#### 프론트엔드 (Firebase Hosting)
```bash
cd susi-front
npm run build
firebase deploy
```

#### 백엔드 (Cloud Run)
```bash
cd susi-back
gcloud run deploy susi-backend \
  --source . \
  --region asia-northeast3 \
  --platform managed \
  --allow-unauthenticated \
  --memory 1Gi \
  --cpu 1 \
  --port 8080
```

## 📝 개발 원칙

1. **독립성 유지**: Hubs 프로젝트의 수정 없이 수시 기능 개발
2. **공유 최소화**: 로그인과 공통 UI만 공유, 나머지는 독립적으로
3. **명확한 경계**: 공유 패키지를 통해서만 Hubs 기능 사용
4. **독립 배포**: 수시 서비스는 독립적으로 배포 가능해야 함

## 🔐 환경 변수

### 프론트엔드 (.env)
```env
VITE_API_URL=http://localhost:4001
VITE_HUBS_API_URL=http://localhost:4000  # Hubs 백엔드 (로그인용)
```

### 백엔드 (.env)
```env
# 데이터베이스 (Hubs와 공유)
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=geobukschool_dev

# JWT (Hubs와 동일 시크릿 사용)
JWT_SECRET=your-secret-key
JWT_EXPIRATION=7d

# 서버 포트
SERVER_PORT=4001
```

## 📚 참고 문서

- [Hubs 아키텍처 문서](../GB-ARCHITECTURE-DOCUMENTATION.md)
- [공유 패키지 가이드](./shared-packages/README.md)
- [API 문서](http://localhost:4001/api-docs) (개발 서버 실행 후)

## 🤝 기여 가이드

1. 기능 브랜치 생성: `git checkout -b feature/your-feature`
2. 변경사항 커밋: `git commit -m 'feat: add some feature'`
3. 브랜치 푸시: `git push origin feature/your-feature`
4. Pull Request 생성

## 📞 문의

프로젝트 관련 문의사항이 있으시면 이슈를 등록해주세요.

---

**Last Updated**: 2026-01-02
**Version**: 0.1.0


