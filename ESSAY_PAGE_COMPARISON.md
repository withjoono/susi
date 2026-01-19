# 논술 페이지 비교 분석

## 📋 요약

**결론**: 현재 프로덕션(susi-front)에는 **간단한 논술 목록 페이지만** 구현되어 있고, 예전 프로젝트(_reference/turtleschool_front)에 있던 **복잡한 필터링 및 단계별 선택 시스템**은 아직 구현되지 않았습니다.

---

## 🔍 비교

### 예전 프로젝트 (turtleschool_front)

#### 📁 구조
```
components_legacy/pages/suSi/nonSul/
├── main/          # 메인 선택 화면
│   └── index.tsx  # 문과/이과/의치한약수/약식 선택
├── mungwa/        # 문과 논술 (7단계)
│   └── index.tsx  # 874줄의 복잡한 로직
├── ligwa/         # 이과 논술 (7단계)
│   └── index.tsx
├── uiChiHanYacSu/ # 의치한약수 논술 (9단계)
│   └── index.tsx
└── component/
    ├── filter/    # 8개의 다양한 필터
    └── table/     # 15개의 다양한 테이블
```

#### ⚙️ 주요 기능

**문과 논술 7단계**:
1. 논술과목선택 (수리논술, 인문논술, 영어포함 등)
2. 이과 교차지원 필터링
3. 약식 논술 필터링
4. 내신 유불리 분석
5. 최저 등급 확인
6. 모집단위 선택
7. 전형 일자 확인

**복잡한 필터링**:
- 수리논술/인문논술 구분
- 영어 포함/제외
- 교차지원 가능 여부
- 수학/과학 과목별 필터링
- 지역인재 필터링
- 기타 특수 전형 필터링

**데이터 연동**:
```typescript
// 예전 API 엔드포인트들
essayMunMathListAPI          // 문과 수리논술
essayOtherListAPI           // 그 외 논술
essayAbleInternalListAPI    // 내신 유불리
essayLowestGradeListAPI     // 최저등급
essayCrossApplyListAPI      // 교차지원
essayAbleNaturalMathListAPI // 자연계 수학
essayAbleScienceListAPI     // 과학과목
essayMedicalEtcListAPI      // 의치한약수 기타
essayMedicalRegionListAPI   // 의치한약수 지역
essayInterestListAPI        // 관심대학
```

---

### 현재 프로젝트 (susi-front)

#### 📁 구조
```
susi-front/src/
├── routes/susi/_layout.nonsul.lazy.tsx  # 간단한 라우트
└── components/services/essay/
    └── essay-list.tsx                    # 195줄의 단순 목록
```

#### ⚙️ 현재 구현된 기능

**단순 목록 표시**:
- 검색 기능 (대학명, 모집단위)
- 기본 정보 표시:
  - 모집단위명
  - 대학코드
  - 모집인원
  - 논술 유형/과목
  - 경쟁률
  - 시험일시
  - 출제 경향
  - 수능 최저등급

**API 엔드포인트**:
```typescript
GET /api-nest/essay?searchKey=xxx&searchWord=xxx&page=1&pageSize=100
```

---

## 🎯 현재 상태

### ✅ 구현된 것
- [x] 논술 전형 기본 목록 조회
- [x] 검색 기능 (디바운싱)
- [x] 최저등급 표시
- [x] 백엔드 API (단순 조회)

### ❌ 구현되지 않은 것
- [ ] 메인 선택 화면 (문과/이과/의치한약수)
- [ ] 7~9단계 필터링 프로세스
- [ ] 교차지원 필터링
- [ ] 내신 유불리 분석
- [ ] 수학/과학 과목별 필터링
- [ ] 약식 논술 구분
- [ ] 관심대학 추가 기능
- [ ] 전형일자별 정렬
- [ ] 상세 모달
- [ ] 15개의 특수 테이블들

---

## 🌐 프로덕션 확인

**프로덕션 URL**: https://www.geobukschool.kr/susi/nonsul

프로덕션 사이트를 확인하면:
- 논술 페이지가 있는지
- 어떤 기능이 구현되어 있는지
- 예전 버전과 동일한지

확인할 수 있습니다.

---

## 💡 권장사항

### 옵션 1: 예전 코드 마이그레이션
장점: 완전한 기능
단점: 복잡한 코드 (874줄), 레거시 의존성

### 옵션 2: 현재 코드 단계적 확장
장점: 깨끗한 코드, 점진적 개선
단점: 시간 소요

### 옵션 3: 프로덕션과 동일하게 구현
장점: 검증된 기능
단점: 프로덕션 상태 확인 필요

---

## 📝 다음 단계

1. **프로덕션 확인**: https://www.geobukschool.kr/susi/nonsul 접속하여 현재 서비스 중인 기능 확인
2. **요구사항 정의**: 어떤 기능이 필요한지 결정
3. **구현 방법 선택**: 마이그레이션 vs 신규 개발
















