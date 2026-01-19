# 백엔드 논술 API 확인 결과

## 📊 예전 API 목록 (레퍼런스)

### 1️⃣ 문과 논술 (인문논술)
```typescript
GET /essay/mun/mathen/list          // 문과 수리논술 대학 목록
GET /essay/other/list               // 그 외 논술 유형
GET /essay/cross/apply/list         // 이과 교차지원 가능 대학
GET /essay/able/internal/list       // 내신 유불리 분석
```

### 2️⃣ 자연 논술 (이과논술)
```typescript
GET /essay/able/natural/math/list   // 자연계 수학 과목 가능 대학
GET /essay/able/science/list        // 과학 과목별 가능 대학
GET /essay/cross/apply/list         // 교차지원 관련
```

### 3️⃣ 의대 논술 (의치한약수)
```typescript
GET /essay/able/medical/math/list   // 의치한약수 수학 과목
GET /essay/able/science/medical/list // 의치한약수 과학 과목
GET /essay/medical/etc/list         // 의치한약수 기타 조건
GET /essay/medical/region/list      // 의치한약수 지역인재
```

### 4️⃣ 공통 API
```typescript
GET /essay/all/list                 // 전체 논술 대학 코드 목록
GET /essay/lowest/grade/list        // 최저등급 확인
GET /essay/interest/list            // 관심대학 조회
POST /essay/add/interest            // 관심대학 추가
GET /nessay/mock/marks/list         // 모의고사 성적 조회
```

---

## ✅ 현재 백엔드 구현 상태

### 구현된 API
```typescript
GET /essay                          // 전체 논술 목록 (searchKey, searchWord로 필터링 가능)
GET /essay/universities             // TODO: 미구현
GET /essay/search                   // TODO: 미구현
```

### 데이터베이스 구조
`essay_list_tb` 테이블에는 **모든 정보가 포함**되어 있습니다:

```typescript
interface EssayListEntity {
  id: number;
  admission_series_code: string;      // 전형 계열 코드
  college_code: string;               // 대학 코드
  recruitment_unit: string;           // 모집단위
  essay_type: string;                 // 논술 유형 ⭐ (인문/자연/의대 구분)
  essay_subject: string;              // 논술 과목 ⭐
  
  // 문과 관련
  mun_mathen: number;                 // 문과 수리논술 여부
  
  // 수학 과목
  common_math: number;                // 공통수학
  geometry: number;                   // 기하
  pb_st: number;                      // 확률과통계
  suone_sutwo: number;                // 수1+수2
  df_in: number;                      // 미적분
  select_math_subject: number;        // 선택 수학과목
  
  // 과학 과목
  common_science: number;             // 공통과학
  hwaone: number;                     // 화학I
  hwaonetwo: number;                  // 화학II
  jiown: number;                      // 지구과학I
  jiowntwo: number;                   // 지구과학II
  mulone: number;                     // 물리I
  mulonetwo: number;                  // 물리II
  sangone: number;                    // 생명과학I
  sangonetwo: number;                 // 생명과학II
  science_designation: number;        // 과학 지정
  select_science_subject: number;     // 선택 과학과목
  
  // 의치한약수 관련
  rthree_etc_code: string;            // 의치한약수 기타 코드
  rthree_etc_flag: number;            // 의치한약수 기타 플래그
  rthree_region_flag: number;         // 의치한약수 지역 플래그
  rthree_region_info: string;         // 의치한약수 지역 정보
  
  // 기타
  cross_support: number;              // 교차지원 가능
  except_nonsul: number;              // 논술 제외
  
  // 기본 정보
  competition_rate: string;           // 경쟁률
  admission_date: string;             // 전형일
  admission_time: string;             // 전형 시간
  student_recruitment_num: number;    // 모집인원
  type_rate: string;                  // 전형 비율
  examination_tendency: string;       // 출제 경향
}
```

---

## 🔍 결론

### ✅ 데이터는 있음
백엔드 데이터베이스에 **모든 정보가 이미 저장**되어 있습니다:
- `essay_type` - 논술 유형 (인문/자연/의대 구분 가능)
- `mun_mathen` - 문과 수리논술
- 수학/과학 과목별 플래그
- 의치한약수 관련 정보
- 교차지원 정보

### ❌ API가 없음
예전처럼 세분화된 API 엔드포인트가 **구현되지 않았습니다**:
- `/essay/mun/mathen/list` ❌
- `/essay/able/natural/math/list` ❌
- `/essay/medical/etc/list` ❌
- 등등...

### 🔧 현재 상태
- 단일 API로 모든 데이터 조회: `GET /essay`
- 프론트엔드에서 필터링 필요
- 또는 백엔드에 세분화된 API 추가 필요

---

## 💡 해결 방법

### 방법 1: 백엔드에 세분화된 API 추가
예전처럼 15개의 세분화된 API 엔드포인트 구현

**장점**: 명확한 API, 서버에서 필터링
**단점**: API 개수 많음, 개발 시간 소요

### 방법 2: 프론트엔드에서 필터링
현재 단일 API로 모든 데이터를 받아서 프론트에서 필터링

**장점**: 빠른 구현, API 단순
**단점**: 데이터 많으면 성능 이슈

### 방법 3: 하이브리드
기본 API + 쿼리 파라미터로 필터링

```typescript
// 예시
GET /essay?essayType=인문논술
GET /essay?essayType=자연논술&hasMath=true
GET /essay?essayType=의대논술&region=서울
```

**장점**: 유연함, 적당한 복잡도
**단점**: 복잡한 쿼리 구현 필요

---

## 📝 다음 단계

1. **데이터 확인**: essay_type 필드에 어떤 값들이 들어있는지 확인
2. **필터 정의**: 인문/자연/의대 구분 기준 정의
3. **API 설계**: 어떤 방식으로 구현할지 결정
4. **프론트 구조**: 메인 선택 화면 → 각 유형별 페이지 구조

현재 샘플 데이터로 essay_type을 확인해볼까요?
















