# 수시 (Susi) 프로젝트

수시 전형 분석 서비스 - Hubs 프로젝트와 로그인을 공유하는 독립 프로젝트

---

## ✅ 프로젝트 설정 완료!

수시 프로젝트의 기본 구조가 완성되었습니다.

### 📁 생성된 구조

```
Susi/
├── susi-front/          # 프론트엔드 (React + Vite)
├── susi-back/           # 백엔드 (NestJS)
├── shared-packages/     # 공유 패키지 (인증, UI, 타입, 유틸)
└── 문서들...
```

### 📚 문서

- **[README.md](./README.md)** - 프로젝트 개요
- **[DEVELOPMENT-GUIDE.md](./DEVELOPMENT-GUIDE.md)** - 개발 시작 가이드 ⭐
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - 아키텍처 설명
- **[PROJECT-STRUCTURE.md](./PROJECT-STRUCTURE.md)** - 전체 파일 구조
- **[DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md)** - 배포 가이드
- **[GIT-SETUP.md](./GIT-SETUP.md)** - Git 설정

---

## 🚀 빠른 시작

### 1. 의존성 설치

```bash
# 프론트엔드
cd susi-front
npm install

# 백엔드
cd ../susi-back
npm install
```

### 2. 환경 변수 설정

프론트엔드와 백엔드에 `.env` 파일을 생성하세요.
자세한 내용은 **[DEVELOPMENT-GUIDE.md](./DEVELOPMENT-GUIDE.md)** 참조

### 3. 개발 서버 실행

```bash
# 프론트엔드 (터미널 1)
cd susi-front
npm run dev
# → http://localhost:3001

# 백엔드 (터미널 2)
cd susi-back
npm run start:dev
# → http://localhost:4001

# Hubs 백엔드 (터미널 3) - 로그인용
cd E:\Dev\github\GB-Back-Nest
npm run start:dev
# → http://localhost:4000
```

---

## 💡 핵심 개념

### Hubs와의 관계

```
수시 프로젝트
  ├─ 공유: 로그인, 회원 DB, 공통 UI
  └─ 독립: 수시 분석 로직, 수시 전용 UI, 배포
```

### 인증 흐름

1. 사용자가 수시 프론트엔드에서 로그인
2. **Hubs 백엔드**(localhost:4000)로 인증 요청
3. JWT 토큰 발급 받음
4. 이후 수시 API는 **수시 백엔드**(localhost:4001) 사용

### 공유 패키지

```typescript
// 로그인
import { loginWithEmail } from '@shared/auth';

// 공통 UI
import { Button } from '@shared/ui';

// 유틸리티
import { formatDate } from '@shared/utils';
```

---

## 📋 다음 단계

1. ✅ **프로젝트 구조 생성 완료**
2. 📝 수시 교과 5단계 API 구현
3. 📝 수시 학종 API 구현
4. 🎨 수시 전용 UI 컴포넌트 개발
5. 🧪 테스트 작성
6. 🚀 배포 설정

---

## 🔑 주요 포트

| 서비스 | 포트 | 용도 |
|--------|------|------|
| 수시 프론트엔드 | 3001 | React 앱 |
| 수시 백엔드 | 4001 | NestJS API |
| Hubs 백엔드 | 4000 | 로그인 전용 |
| MySQL | 3306 | 데이터베이스 |

---

## 📞 문의

프로젝트 관련 문의사항이 있으시면 이슈를 등록해주세요.

**Happy Coding! 🎉**


















