# 수시 프로젝트 개발 가이드

## 시작하기

### 1. 프로젝트 구조 확인

```
Susi/
├── susi-front/          # 프론트엔드
├── susi-back/           # 백엔드
├── shared-packages/     # 공유 패키지
└── README.md
```

### 2. 프론트엔드 개발 서버 실행

```bash
cd susi-front
npm install
npm run dev
```

서버: http://localhost:3001

### 3. 백엔드 개발 서버 실행

```bash
cd susi-back
npm install

# .env 파일 설정 (아래 환경 변수 설정 참조)
npm run start:dev
```

서버: http://localhost:4001
API 문서: http://localhost:4001/api-docs

## 환경 변수 설정

### 프론트엔드 (.env)

`susi-front/.env` 파일을 생성하세요:

```env
# 수시 백엔드 API
VITE_API_URL=http://localhost:4001

# Hubs 백엔드 API (로그인 전용)
VITE_HUBS_API_URL=http://localhost:4000

# 애플리케이션 이름
VITE_APP_NAME=수시 - 거북스쿨
```

### 백엔드 (.env)

`susi-back/.env` 파일을 생성하세요:

```env
# 데이터베이스 (Hubs와 공유)
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=geobukschool_dev
DB_SYNCHRONIZE=false

# JWT (Hubs와 동일한 시크릿 사용 필수!)
JWT_SECRET=your-secret-key-here
JWT_EXPIRATION=7d

# 서버 설정
NODE_ENV=development
SERVER_PORT=4001

# CORS 설정
CORS_ORIGIN=http://localhost:3001
```

**중요**: `JWT_SECRET`은 Hubs 백엔드와 동일한 값을 사용해야 합니다!

## Hubs 백엔드 실행 (로그인용)

수시 프로젝트에서 로그인 기능을 사용하려면 Hubs 백엔드도 실행되어 있어야 합니다.

```bash
# Hubs 백엔드 디렉토리로 이동
cd E:\Dev\github\GB-Back-Nest

# 개발 서버 실행
npm run start:dev
```

서버: http://localhost:4000

## 개발 워크플로우

### 1. 로그인 기능 사용

로그인은 Hubs의 인증 시스템을 공유합니다:

```typescript
// 프론트엔드에서 로그인
import { loginWithEmail } from '@shared/auth';

const response = await loginWithEmail('user@example.com', 'password');
// Hubs 백엔드 (localhost:4000)로 요청이 갑니다
```

### 2. 수시 API 사용

로그인 후 수시 전용 기능은 수시 백엔드를 사용합니다:

```typescript
import { apiClient } from '@/lib/api-client';

const response = await apiClient.get('/susi/step-1');
// 수시 백엔드 (localhost:4001)로 요청이 갑니다
```

### 3. 공유 컴포넌트 사용

```typescript
import { Button } from '@shared/ui';
import { formatDate } from '@shared/utils';

function MyComponent() {
  return (
    <Button onClick={() => console.log(formatDate(new Date()))}>
      클릭
    </Button>
  );
}
```

## 데이터베이스 설정

### MySQL 데이터베이스 생성

```sql
CREATE DATABASE geobukschool_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Hubs 데이터베이스 공유

수시 프로젝트는 Hubs와 동일한 데이터베이스를 사용합니다:
- 회원 정보 (member_tb)
- 대학/전형 마스터 데이터
- 수시 전형 데이터

## 자주 묻는 질문 (FAQ)

### Q: 로그인이 작동하지 않습니다.

A: Hubs 백엔드가 실행 중인지 확인하세요 (localhost:4000). 
   프론트엔드의 VITE_HUBS_API_URL 설정도 확인하세요.

### Q: JWT_SECRET을 어떻게 확인하나요?

A: Hubs 백엔드의 `.env` 파일에서 확인할 수 있습니다:
   `E:\Dev\github\GB-Back-Nest\.env`

### Q: 데이터베이스 접속 오류가 발생합니다.

A: MySQL이 실행 중인지 확인하고, DB_HOST, DB_PORT, DB_USER, DB_PASSWORD가 올바른지 확인하세요.

### Q: 포트가 이미 사용 중입니다.

A: 
- 프론트엔드: vite.config.ts에서 포트 변경
- 백엔드: .env에서 SERVER_PORT 변경

## 다음 단계

1. ✅ 프로젝트 구조 생성 완료
2. 📝 수시 교과 5단계 API 구현
3. 🎨 수시 전용 UI 컴포넌트 개발
4. 🧪 테스트 작성
5. 🚀 배포 설정

---

**문의사항이 있으시면 이슈를 등록해주세요!**


















