# ServiceCardsPage 분석 문서

**생성일**: 2025-01-13
**목적**: Hub 프론트엔드로 이동 전 ServiceCardsPage 컴포넌트 분석 및 백업

## 개요

ServiceCardsPage는 거북스쿨 플랫폼의 모든 서비스를 보여주는 메인 랜딩 페이지입니다.
이 컴포넌트는 Susi 앱이 아닌 Hub 프론트엔드에서 관리되어야 합니다.

## 파일 위치

**현재**: `E:\Dev\github\Susi\susi-front\src\components\service-cards-page.tsx` (464 lines)
**예정**: `E:\Dev\github\GB-Front\src\components\service-cards-page.tsx`

## 주요 기능

### 1. 서비스 섹션 구성

컴포넌트는 3개의 서비스 섹션으로 구성:

#### 현재 서비스 중 (Current Services)
- **정시 예측 분석** (Jungsi)
  - 가격: 유료
  - 경로: `/jungsi` (내부 링크)
  - 특징: 대학별 유불리, 모의지원 기반 시뮬레이션, 정시 모의지원 앱 등

#### 겨울방학부터 서비스 (Winter Services) - 9개
1. **Exam Hub**
   - 외부 서비스: `MYEXAM_URL` (localhost:3000)
   - SSO 지원
   - 성적 분석, 취약 부분 관리, 오답 관리

2. **플래너**
   - 외부 서비스: `STUDYPLANNER_URL` (localhost:3001)
   - SSO 지원
   - 장기계획, 주간 루틴 자동 계획

3. **수업 현황**
   - 내부 링크: `/class-status`
   - 수업 계획, 진도, 과제 현황

4. **생기부관리**
   - 내부 링크: `/grade-analysis/school-record`
   - AI 사정관 평가 유료
   - 교과/비교과 관리

5. **2027 수시 예측 분석**
   - 내부 링크: `/susi`
   - 가격: 유료
   - AI 사정관 평가, 대학별 유불리, 무료 모의지원 앱

6. **전형 검색 및 입시 상담**
   - 내부 링크: `/explore`
   - 가격: 무료 + Members
   - 전형 검색 DB, AI 거북쌤 상담

7. **마이 그룹**
   - 내부 링크: `/my-group`
   - 가격: Members
   - 플래너 실행 비교, 퀴즈 점수 비교

8. **그룹 스터디**
   - 내부 링크: `/group-study`
   - 가격: Members
   - 그룹 스터디 조짜기, 실행 계획 관리

9. **계정 연동**
   - 내부 링크: `/users/profile`
   - 가격: 무료
   - 학부모/선생님 연동

#### 3월 신학기부터 서비스 (Spring Services)
- **맞춤 입시 정보 딜리버리**
  - 가격: Members
  - 경로: `/admission-info`
  - 상태: disabled (곧 오픈)

### 2. 외부 서비스 통합

#### 환경 변수
```typescript
const MYEXAM_URL = import.meta.env.VITE_MYEXAM_URL || "http://localhost:3000";
const STUDYPLANNER_URL = import.meta.env.VITE_STUDYPLANNER_URL || "http://localhost:3001";
```

#### SSO (Single Sign-On) 처리
- `isSSOService(href)`: 서비스가 SSO를 지원하는지 확인
- `generateSSOUrl(href)`: accessToken과 함께 SSO URL 생성
- 로그인 상태에서 외부 서비스 클릭 시 토큰 전달
- 새 탭으로 열기 (`window.open`)

### 3. UI 구성 요소

#### Hero Section
```typescript
<div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full">
  <Zap className="w-4 h-4" />
  거북스쿨의 AI 앱 서비스
</div>
<h1 className="text-3xl md:text-4xl font-bold">
  입시의 모든 것을 거북스쿨에서!
</h1>
```

#### 거북쌤 소개 섹션
- 이미지: `/images/geobuk-ssam.png`
- 말풍선 스타일 소개글
- 반응형 레이아웃 (모바일/데스크탑)

#### ServiceSection 컴포넌트
**Props**:
```typescript
interface ServiceSectionProps {
  title: string;          // 섹션 제목
  subtitle: string;       // 섹션 부제
  icon: React.ReactNode;  // 섹션 아이콘
  services: ServiceCard[]; // 서비스 카드 배열
  badgeColor: string;     // 배지 배경색
  bgColor: string;        // 섹션 배경색
}
```

**ServiceCard 인터페이스**:
```typescript
interface ServiceCard {
  id: string;           // 고유 식별자
  title: string;        // 서비스 제목
  price: string;        // 가격 정보
  description: string;  // 설명
  icon: React.ReactNode; // 아이콘
  href: string;         // 링크 (내부 또는 외부)
  color: string;        // 색상 클래스
  bgGradient: string;   // 그라디언트 배경
  features: string[];   // 기능 목록
  disabled?: boolean;   // 비활성화 여부
  isExternal?: boolean; // 외부 링크 여부
}
```

#### 카드 디자인
- **헤더**: 그라디언트 배경, 가격 태그, 아이콘
- **본문**: 기능 목록 (bullets)
- **푸터**: "바로가기" CTA with 화살표
- **상태**:
  - 활성: hover 효과 (shadow-xl, -translate-y-1)
  - 비활성: opacity 70%, "곧 오픈" 오버레이
  - 개발 모드: 모든 서비스 활성화 (`import.meta.env.DEV`)

### 4. 라우팅 로직

#### 내부 링크
```typescript
<Link to={service.href} className={cardClassName}>
  {cardContent}
</Link>
```

#### 외부 링크
```typescript
<a
  href={service.href}
  target="_blank"
  rel="noopener noreferrer"
  onClick={handleExternalClick}
>
  {cardContent}
</a>
```

#### SSO 처리
```typescript
const handleExternalClick = (e: React.MouseEvent) => {
  if (isSSOService(service.href) && accessToken) {
    e.preventDefault();
    const ssoUrl = generateSSOUrl(service.href);
    window.open(ssoUrl, '_blank', 'noopener,noreferrer');
  }
};
```

## 의존성

### Import 목록
```typescript
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { generateSSOUrl, isSSOService } from "@/lib/utils/sso-helper";
import { useAuthStore } from "@/stores/client/use-auth-store";
import { /* 20+ icons */ } from "lucide-react";
```

### 필요한 유틸리티
- **sso-helper.ts**: SSO URL 생성 및 서비스 확인
- **use-auth-store.ts**: accessToken 제공
- **utils.ts**: `cn` 함수 (classname 병합)

### 필요한 에셋
- `/images/geobuk-ssam.png`: 거북쌤 이미지

## Hub로 이동 시 작업 항목

### Phase 1: 파일 이동 및 경로 수정
- [ ] ServiceCardsPage 컴포넌트를 GB-Front로 복사
- [ ] import 경로 수정 (`@/` 별칭)
- [ ] sso-helper 유틸리티 이동 또는 공유
- [ ] use-auth-store 또는 Hub용 auth store 연동

### Phase 2: 환경 변수 설정
- [ ] GB-Front `.env` 파일에 외부 서비스 URL 추가
  ```
  VITE_MYEXAM_URL=http://localhost:3000
  VITE_STUDYPLANNER_URL=http://localhost:3001
  VITE_SUSI_URL=http://localhost:3002
  ```

### Phase 3: 라우팅 구성
- [ ] GB-Front의 루트 (`/`)에 ServiceCardsPage 설정
- [ ] 각 앱의 헤더에 "전체 서비스" 버튼 추가 (Hub 링크)

### Phase 4: SSO 토큰 전달
- [ ] Hub에서 각 앱으로 accessToken 전달 방식 구현
- [ ] 각 앱에서 SSO 토큰 수신 및 검증 로직 구현

### Phase 5: 이미지 에셋
- [ ] `/public/images/geobuk-ssam.png` 파일을 GB-Front로 복사

## 제거 작업 (Susi-Front)

### Phase 1: 참조 제거
- [x] `routes/index.tsx`에서 ServiceCardsPage import 제거
- [x] Navigate to `/susi`로 변경

### Phase 2: 컴포넌트 삭제 (Hub 이동 완료 후)
- [ ] `components/service-cards-page.tsx` 삭제
- [ ] 사용하지 않는 SSO 관련 유틸리티 정리

## 아키텍처 결정 이유

**왜 Hub가 ServiceCardsPage를 담당해야 하는가?**

1. **플랫폼 중립성**: 모든 서비스를 나열하므로 특정 앱(Susi)에 종속되면 안됨
2. **SSO 중앙 관리**: 토큰 발급 및 전달이 Hub의 핵심 책임
3. **서비스 디스커버리**: 사용자가 서비스를 선택하는 진입점
4. **확장성**: 새 서비스 추가 시 Hub만 수정하면 됨

## 다음 단계

1. ✅ Susi 루트 페이지를 `/susi`로 리다이렉트
2. ✅ ServiceCardsPage 분석 및 문서화
3. ⏳ GB-Front 프로젝트 생성
4. ⏳ ServiceCardsPage를 GB-Front로 이동
5. ⏳ Header에 Hub 메인 링크 추가
6. ⏳ SSO 토큰 전달 방식 구현

---

**문서 작성자**: Claude Code
**마지막 업데이트**: 2025-01-13
