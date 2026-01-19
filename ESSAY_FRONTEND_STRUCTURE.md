# 논술 프론트엔드 구조 (turtleschool_2023)

## 📁 전체 구조

```
susi-front/_reference/turtleschool_front/src/
└── components_legacy/pages/suSi/nonSul/
    ├── main/                    # 메인 선택 화면
    │   ├── index.tsx           # 4가지 유형 선택 (874줄)
    │   └── style.scss
    │
    ├── mungwa/                  # 문과 논술
    │   ├── index.tsx           # 7단계 프로세스 (874줄)
    │   └── style.scss
    │
    ├── ligwa/                   # 이과 논술
    │   ├── index.tsx           # 7단계 프로세스
    │   └── style.scss
    │
    ├── uiChiHanYacSu/          # 의치한약수 논술
    │   ├── index.tsx           # 9단계 프로세스
    │   ├── useUiChiHanYacSu.ts
    │   └── style.scss
    │
    └── component/
        ├── filter/              # 필터 컴포넌트 (8개)
        │   ├── K_논술필터.tsx
        │   ├── K_약식논술필터.tsx
        │   ├── nonSulFilter.tsx
        │   ├── scienceFilter.tsx
        │   ├── suriNonsulAndEngFilter.tsx
        │   ├── suriNonsulSelectFilter.tsx
        │   ├── inputNaesinFilter.tsx
        │   └── style.scss
        │
        └── table/               # 테이블 컴포넌트 (15개)
            ├── suriNonSulTable.tsx              # 수리논술 테이블
            ├── K_문과_약식논술테이블.tsx         # 약식논술 테이블
            ├── ligwaCrossableTable.tsx          # 이과 교차지원
            ├── lowestGradeOfUnivTable.tsx       # 최저등급
            ├── mathAbletable.tsx                # 수학 가능과목
            ├── medicalEtcTable.tsx              # 의대 기타
            ├── medicalMathableTable.tsx         # 의대 수학
            ├── mediclaScienceAbleDepartment.tsx # 의대 과학
            ├── naesinAdvantageDepartmentTable.tsx # 내신 유불리
            ├── otherNonsulTypeTable.tsx         # 기타 논술유형
            ├── regionTalentTable.tsx            # 지역인재
            ├── scienceAbleTable.tsx             # 과학 가능과목
            ├── selectDepartmentTable.tsx        # 선택 모집단위
            ├── applyDateTable.tsx               # 전형일자
            └── style.scss
```

---

## 📄 핵심 파일 목록

### 1. 메인 화면 (main/index.tsx)
**경로**: `components_legacy/pages/suSi/nonSul/main/index.tsx`

**기능**:
- 4가지 논술 유형 선택 카드
  1. 문과 논술
  2. 이과 논술
  3. 의치한약수 논술
  4. 약식논술 (Coming Soon)
- 이용권 체크
- 로그인 체크

### 2. 문과 논술 (mungwa/index.tsx) - 874줄
**경로**: `components_legacy/pages/suSi/nonSul/mungwa/index.tsx`

**7단계 프로세스**:
```typescript
Step 0: 논술과목선택 (수리논술/인문논술/영어포함)
Step 1: 이과 교차지원 필터링
Step 2: 약식 논술 필터링
Step 3: 내신 유불리 분석
Step 4: 최저 등급 확인
Step 5: 모집단위 선택
Step 6: 전형 일자 확인
```

**주요 State**:
```typescript
const [suriNonsulFilter, setSuriNonsulFilter] = useState<string[]>([]);
const [engFilter, setEngFilter] = useState<string[]>([]);
const [crossApplyFilter, setCrossApplyFilter] = useState({
  '수리 범위가 수1+수2': false,
  '언어논술 포함 이과논술': false,
});
const [yaksikFilter, setYaksikFilter] = useState({
  문과: false,
  이과: false,
});
const [selectedDepartmentList, setSelectedDepartmentList] = useState<number[]>([]);
```

**사용 API**:
```typescript
essayMunMathListFetch()           // 문과 수리논술 목록
essayOtherListFetch()             // 기타 논술 목록
essayCrossApplyListFetch()        // 교차지원 목록
essayAbleInternalListFetch()      // 내신 유불리
essayLowestGradeListFetch()       // 최저등급
essayAddInterestFetch()           // 관심대학 추가
```

### 3. 이과 논술 (ligwa/index.tsx)
**경로**: `components_legacy/pages/suSi/nonSul/ligwa/index.tsx`

**7단계 프로세스**:
```typescript
Step 0: 수학 과목 선택
Step 1: 과학 과목 선택
Step 2: 약식 논술 필터링
Step 3: 내신 유불리 분석
Step 4: 최저 등급 확인
Step 5: 모집단위 선택
Step 6: 전형 일자 확인
```

**사용 API**:
```typescript
essayAbleNaturalMathListFetch()   // 자연계 수학 과목
essayAbleNaturalScienceListFetch() // 자연계 과학 과목
```

### 4. 의치한약수 논술 (uiChiHanYacSu/index.tsx)
**경로**: `components_legacy/pages/suSi/nonSul/uiChiHanYacSu/index.tsx`

**9단계 프로세스**:
```typescript
Step 0: 수학 과목 선택
Step 1: 과학 과목 선택
Step 2: 기타 가능선택 (영어/논술유형)
Step 3: 지역인재 확인
Step 4: 약식 논술 필터링
Step 5: 내신 유불리 분석
Step 6: 최저 등급 확인
Step 7: 모집단위 선택
Step 8: 전형 일자 확인
```

**사용 API**:
```typescript
essayMedicalMathListFetch()       // 의대 수학 과목
essayMedicalScienceListFetch()    // 의대 과학 과목
essayMedicalEtcFetch()            // 의대 기타 조건
essayMedicalRegionListFetch()     // 의대 지역인재
```

---

## 🔧 필터 컴포넌트

### K_논술필터.tsx
문과/이과/의대 논술 선택 필터

### suriNonsulAndEngFilter.tsx
- 수리논술 선택 (인문논술/수리논술)
- 영어 포함 선택

### scienceFilter.tsx
과학 과목 선택:
- 화학I, 화학II
- 물리I, 물리II
- 생명과학I, 생명과학II
- 지구과학I, 지구과학II

### inputNaesinFilter.tsx
내신 등급 입력 (1~9등급)

### K_약식논술필터.tsx
약식 논술 필터 (문과/이과)

---

## 📊 테이블 컴포넌트

### suriNonSulTable.tsx
수리논술 가능 대학 목록 테이블

### mathAbletable.tsx
수학 과목별 가능 대학 테이블

### scienceAbleTable.tsx
과학 과목별 가능 대학 테이블

### lowestGradeOfUnivTable.tsx
수능 최저등급 테이블 (체크박스로 선택)

### naesinAdvantageDepartmentTable.tsx
내신 점수등급차 테이블 (유리한 대학 표시)

### applyDateTable.tsx
전형 일자 테이블 (날짜별 정렬)

---

## 🎨 스타일링

모든 컴포넌트는 **SCSS** 사용:
```scss
// style.scss
#nonSulMain {
  .serviceBox {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    
    .serviceCard {
      border: 1px solid #e0e0e0;
      border-radius: 12px;
      padding: 24px;
      cursor: pointer;
      transition: all 0.3s;
      
      &:hover {
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      }
    }
  }
}
```

---

## 🔗 API 엔드포인트 (예전 버전)

### api/urls.ts
```typescript
// 83-98줄
export const essayMockMarkListAPI = '/nessay/mock/marks/list'
export const essayAllListAPI = '/essay/all/list'
export const essayMunMathListAPI = '/essay/mun/mathen/list'
export const essayOtherListAPI = '/essay/other/list'
export const essayAbleInternalListAPI = '/essay/able/internal/list'
export const essayLowestGradeListAPI = '/essay/lowest/grade/list'
export const essayCrossApplyListAPI = '/essay/cross/apply/list'
export const essayAbleNaturalMathListAPI = '/essay/able/natural/math/list'
export const essayAbleScienceListAPI = '/essay/able/science/list'
export const essayAddInterestAPI = '/essay/add/interest'
export const essayInterestListAPI = '/essay/interest/list'
export const essayMedicalEtcListAPI = '/essay/medical/etc/list'
export const essayMedicalRegionListAPI = '/essay/medical/region/list'
export const essayAbleMedicalMathListAPI = '/essay/able/medical/math/list'
export const essayAbleScienceMedicalListAPI = '/essay/able/science/medical/list'
```

### api/fetches/essay.ts
409줄의 API 호출 함수들

---

## 📈 코드 통계

| 항목 | 개수 | 총 라인수 |
|------|------|----------|
| 메인 페이지 | 4개 | ~3,500줄 |
| 필터 컴포넌트 | 8개 | ~1,000줄 |
| 테이블 컴포넌트 | 15개 | ~2,500줄 |
| API 함수 | 18개 | ~400줄 |
| **총합** | **45개** | **~7,400줄** |

---

## 🚀 마이그레이션 필요 사항

### 1. 기술 스택 변경
- React Router → TanStack Router
- Recoil → Zustand (또는 TanStack Query)
- SCSS → Tailwind CSS
- MUI → Radix UI + shadcn/ui

### 2. 파일 구조 변경
```
예전: components_legacy/pages/suSi/nonSul/
현재: src/routes/susi/_layout.nonsul/
```

### 3. API 변경
```
예전: 15개 세분화된 API
현재: 1개 통합 API (필터링 로직 변경 필요)
```

---

## 💡 다음 단계

1. **메인 선택 화면 구현** (간단)
   - 4개 카드만 표시

2. **문과 논술부터 시작** (중간 복잡도)
   - 7단계 프로세스
   - 기존 코드 참고하여 재작성

3. **이과/의대 논술 추가** (복잡)
   - 과목 선택 로직

4. **API 설계 결정**
   - 백엔드에 API 추가 vs 프론트에서 필터링
















