# 수시 경쟁률 데이터 가져오기 가이드

이 가이드는 UWAY Excel 파일의 수시 경쟁률 데이터를 데이터베이스에 가져오는 방법을 설명합니다.

## 📋 개요

- **Excel 파일**: `UWAY_수시_경쟁률_V5_2026-01-06.xlsx`
- **데이터 개수**: 33,021개 레코드
- **대상 테이블**: `application_rates`

## 🔧 전제 조건

1. **PostgreSQL 데이터베이스 실행 중**
   ```bash
   # Windows
   setup-db.bat

   # Linux/Mac
   ./setup-db.sh
   ```

2. **Node.js 패키지 설치**
   ```bash
   cd susi-back
   yarn install  # 또는 npm install
   ```

## 📊 데이터 구조

### Excel 파일 필드
- `대학명`: 대학 이름 (예: "강원대학교(강릉캠퍼스,원주캠퍼스)")
- `캠퍼스`: 단과대학 (예: "인문대학")
- `전형명`: 전형 구분 (예: "정원 외 학생부교과(특수교육대상자)")
- `모집단위`: 학과명 (예: "일본학과")
- `모집인원`: 모집 정원 (빈 값 가능)
- `지원인원`: 지원자 수
- `경쟁률`: 경쟁률 (예: "2 : 1")

### 데이터베이스 필드 매핑
| Excel 필드 | DB 컬럼 | 변환 |
|-----------|---------|------|
| 대학명 | university_name, university_code | 코드 매핑 적용 |
| 캠퍼스 + 모집단위 | department_name | 결합 |
| 전형명 | admission_type | 그대로 |
| 모집인원 | recruitment_count | 숫자로 변환 |
| 지원인원 | application_count | 숫자로 변환 |
| 경쟁률 | competition_rate | 숫자로 파싱 (예: "2 : 1" → 2.0) |

## 🚀 사용 방법

### 1. 기본 실행 (기존 데이터 유지)
```bash
cd susi-back
node import-competition-rates.js
```

이 방법은:
- 기존 데이터를 유지합니다
- 동일한 (대학코드, 모집단위, 전형) 조합이 있으면 업데이트합니다
- 새로운 데이터는 추가합니다

### 2. 기존 데이터 삭제 후 실행
```bash
cd susi-back
node import-competition-rates.js --delete-existing
```

이 방법은:
- `application_rates` 테이블의 모든 데이터를 삭제합니다
- Excel 파일의 데이터를 새로 삽입합니다

## 📝 스크립트 동작

1. **Excel 파일 읽기**: `UWAY_수시_경쟁률_V5_2026-01-06.xlsx` 파일 로드
2. **데이터 변환**:
   - 대학명 → 대학 코드 매핑
   - 경쟁률 문자열 파싱 ("2 : 1" → 2.0)
   - 캠퍼스와 모집단위 결합
3. **중복 체크**: 기존 데이터 확인
4. **삽입/업데이트**: 트랜잭션으로 데이터 저장
5. **통계 출력**: 대학별 경쟁률 통계 표시

## 🏫 대학 코드 매핑

스크립트는 다음 대학들의 코드를 자동으로 매핑합니다:

- 가천대학교: 10190551
- 가톨릭대학교: 10180521
- 건국대학교(서울): 10080311
- 건국대학교(글로컬): 10090831
- 경희대학교: 10080521
- 고려대학교(서울): 10080111
- 서울대학교: 10080011
- 연세대학교(서울): 10080121
- ... (총 29개 대학)

매핑되지 않은 대학은 `UNK_` 접두사와 함께 임시 코드가 생성됩니다.

## ⚠️ 주의사항

1. **데이터베이스 백업**: 프로덕션 환경에서 실행하기 전에 반드시 백업하세요
2. **트랜잭션**: 에러 발생 시 모든 변경사항이 롤백됩니다
3. **실행 시간**: 33,000개 데이터 삽입에 약 5-10분 소요
4. **메모리**: 대용량 Excel 파일 로드로 충분한 메모리 필요

## 📊 출력 예시

```
🚀 수시 경쟁률 데이터 가져오기 시작

📚 Excel 파일 읽는 중...
✅ 총 33021개 데이터 로드 완료

📝 데이터 삽입 시작...

진행 중: 1000/33021 (3%)
진행 중: 2000/33021 (6%)
...

✅ 데이터 삽입 완료!
====================
✅ 삽입 성공: 32500개
⚠️  건너뜀: 500개
❌ 에러: 21개
====================

📊 대학별 통계 (상위 10개):
┌─────────┬──────────────────┬───────┬──────────────────┬──────────────────┬──────────┐
│ (index) │ university_name  │ count │ total_recruitment│ total_application│ avg_rate │
├─────────┼──────────────────┼───────┼──────────────────┼──────────────────┼──────────┤
│    0    │ '서울대학교'      │  450  │      3500        │      45000       │   12.86  │
│    1    │ '연세대학교(서울)'│  380  │      3200        │      38000       │   11.88  │
...
```

## 🔍 데이터 확인

데이터가 제대로 삽입되었는지 확인:

```bash
# PostgreSQL 접속
docker exec -it geobuk-postgres psql -U tsuser -d geobukschool_dev

# 데이터 확인
SELECT COUNT(*) FROM application_rates;
SELECT * FROM application_rates LIMIT 10;
SELECT university_name, COUNT(*) as count
FROM application_rates
GROUP BY university_name
ORDER BY count DESC;
```

## 🐛 문제 해결

### 데이터베이스 연결 실패
```bash
# PostgreSQL 컨테이너 상태 확인
docker ps | grep postgres

# 컨테이너가 없다면 시작
cd susi-back
setup-db.bat  # 또는 ./setup-db.sh
```

### 환경 변수 설정
`.env.development` 파일에서 데이터베이스 설정 확인:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=tsuser
DB_PASSWORD=tsuser1234
DB_DATABASE=geobukschool_dev
```

### Excel 파일을 찾을 수 없음
```bash
# 파일 위치 확인
ls -la UWAY_수시_경쟁률_V5_2026-01-06.xlsx

# 파일이 다른 위치에 있다면 스크립트에서 경로 수정
# import-competition-rates.js의 6번째 라인
```

## 🔄 API 테스트

데이터 삽입 후 API 테스트:

```bash
# 백엔드 서버 시작
yarn start:dev

# API 테스트
curl http://localhost:4001/application-rate
```

프론트엔드에서 확인:
1. http://localhost:3000/susi/competition-rate 접속
2. 실시간 경쟁률 데이터 확인

## 📚 관련 파일

- `import-competition-rates.js` - 데이터 가져오기 스크립트
- `read-excel-competition.js` - Excel 데이터 분석 스크립트
- `competition-rate-data.json` - 변환된 JSON 데이터
- `src/modules/application-rate/` - 백엔드 모듈
- `susi-front/src/components/services/competition-rate/` - 프론트엔드 컴포넌트
