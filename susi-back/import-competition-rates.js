const XLSX = require('xlsx');
const { Pool } = require('pg');

// PostgreSQL 연결 설정 (환경 변수 또는 기본값 사용)
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'tsuser',
  password: process.env.DB_PASSWORD || 'tsuser1234',
  database: process.env.DB_DATABASE || 'geobukschool_dev',
});

// 대학명과 대학 코드 매핑 (application-rate.service.ts 참조)
const universityCodeMap = {
  '가천대학교': '10190551',
  '가톨릭대학교': '10180521',
  '건국대학교(서울)': '10080311',
  '건국대학교(글로컬)': '10090831',
  '경남대학교': '10130521',
  '경북대학교': '10100521',
  '경희대학교': '10080521',
  '고려대학교(서울)': '10080111',
  '고려대학교(세종)': '10040821',
  '광운대학교': '10150521',
  '국민대학교': '10080521',
  '단국대학교(죽전)': '10080721',
  '덕성여자대학교': '10080811',
  '동국대학교(서울)': '10080911',
  '동아대학교': '10130712',
  '명지대학교': '10081011',
  '부산대학교': '10130111',
  '상명대학교(서울)': '10081211',
  '서강대학교': '10080211',
  '서울대학교': '10080011',
  '서울시립대학교': '10081411',
  '성균관대학교': '10081511',
  '세종대학교': '10081611',
  '숙명여자대학교': '10081711',
  '숭실대학교': '10081811',
  '아주대학교': '10081911',
  '연세대학교(서울)': '10080121',
  '연세대학교(미래)': '10120821',
  '이화여자대학교': '10082111',
  '인하대학교': '10082211',
  '중앙대학교(서울)': '10082311',
  '한국외국어대학교(서울)': '10082511',
  '한양대학교(서울)': '10082611',
  '한양대학교(ERICA)': '10040812',
  '홍익대학교(서울)': '10082711',
};

// 안전한 정수 파싱 (다양한 형식 처리)
function safeParseInt(value) {
  if (!value) return 0;

  const str = String(value).trim();

  // "-" 또는 빈 값
  if (str === '-' || str === '' || str === 'NaN' || str === 'nan') return 0;

  // 괄호 안의 숫자 (예: "(10)" → 10)
  const bracketMatch = str.match(/\((\d+)\)/);
  if (bracketMatch) return parseInt(bracketMatch[1], 10);

  // 일반 숫자 파싱 (쉼표 제거)
  const cleaned = str.replace(/,/g, '');
  const num = parseInt(cleaned, 10);

  return isNaN(num) ? 0 : num;
}

// 경쟁률 문자열 파싱 ("2 : 1" → 2.0)
function parseCompetitionRate(rateStr) {
  if (!rateStr || typeof rateStr !== 'string') return 0;

  const str = rateStr.trim();

  // "nan : 1", "inf : 1", "-" 같은 특수 케이스
  if (str === '-' || str === '' || str.toLowerCase().includes('nan') || str.toLowerCase().includes('inf')) {
    return 0;
  }

  const match = str.match(/^(\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : 0;
}

// 대학명에서 대학 코드 찾기 (부분 매칭 지원)
function findUniversityCode(universityName) {
  // 정확한 매칭 시도
  if (universityCodeMap[universityName]) {
    return universityCodeMap[universityName];
  }

  // 부분 매칭 시도 (예: "강원대학교(강릉캠퍼스,원주캠퍼스)" → 찾을 수 없음)
  for (const [key, code] of Object.entries(universityCodeMap)) {
    if (universityName.includes(key) || key.includes(universityName)) {
      return code;
    }
  }

  // 매핑되지 않은 대학은 대학명 기반으로 임시 코드 생성
  return 'UNK_' + universityName.substring(0, 10).replace(/\s/g, '_');
}

async function importCompetitionRates() {
  const client = await pool.connect();

  try {
    console.log('📚 Excel 파일 읽는 중...');
    const workbook = XLSX.readFile('./UWAY_수시_경쟁률_V5_2026-01-06.xlsx');
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    console.log(`✅ 총 ${data.length}개 데이터 로드 완료\n`);

    // 트랜잭션 시작
    await client.query('BEGIN');

    // 기존 데이터 삭제 (선택사항)
    const deleteExisting = process.argv.includes('--delete-existing');
    if (deleteExisting) {
      console.log('🗑️  기존 데이터 삭제 중...');
      await client.query('DELETE FROM application_rates');
      console.log('✅ 기존 데이터 삭제 완료\n');
    }

    console.log('📝 데이터 삽입 시작...\n');

    let insertedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    const crawledAt = new Date();
    const sourceUrl = 'https://www.uway.com';

    for (const row of data) {
      try {
        const universityName = row['대학명'];
        const campus = row['캠퍼스'] || ''; // 단과대학 정보
        const admissionType = row['전형명'];
        const departmentName = row['모집단위'];
        const recruitmentCountStr = row['모집인원'];
        const applicationCountStr = row['지원인원'];
        const competitionRateStr = row['경쟁률'];

        // 필수 필드 검증
        if (!universityName || !departmentName) {
          skippedCount++;
          continue;
        }

        // 데이터 변환
        const universityCode = findUniversityCode(universityName);
        const recruitmentCount = safeParseInt(recruitmentCountStr);
        const applicationCount = safeParseInt(applicationCountStr);
        const competitionRate = parseCompetitionRate(competitionRateStr);

        // 캠퍼스 정보를 모집단위명에 포함 (필요시)
        const fullDepartmentName = campus ? `${campus} ${departmentName}` : departmentName;

        // 중복 체크 후 데이터 삽입
        const checkQuery = `
          SELECT id FROM application_rates
          WHERE university_code = $1 AND department_name = $2 AND admission_type = $3
        `;
        const existing = await client.query(checkQuery, [universityCode, fullDepartmentName, admissionType]);

        let query;
        let params;

        if (existing.rows.length > 0) {
          // 업데이트
          query = `
            UPDATE application_rates SET
              recruitment_count = $1,
              application_count = $2,
              competition_rate = $3,
              crawled_at = $4,
              updated_at = NOW()
            WHERE university_code = $5 AND department_name = $6 AND admission_type = $7
          `;
          params = [
            recruitmentCount,
            applicationCount,
            competitionRate,
            crawledAt,
            universityCode,
            fullDepartmentName,
            admissionType,
          ];
        } else {
          // 삽입
          query = `
            INSERT INTO application_rates (
              university_code,
              university_name,
              department_name,
              admission_type,
              recruitment_count,
              application_count,
              competition_rate,
              source_url,
              crawled_at,
              created_at,
              updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
          `;
          params = [
            universityCode,
            universityName,
            fullDepartmentName,
            admissionType,
            recruitmentCount,
            applicationCount,
            competitionRate,
            sourceUrl,
            crawledAt,
          ];
        }

        await client.query(query, params);

        insertedCount++;

        // 진행 상황 출력 (1000개마다)
        if (insertedCount % 1000 === 0) {
          console.log(`진행 중: ${insertedCount}/${data.length} (${Math.round(insertedCount/data.length*100)}%)`);
        }

      } catch (error) {
        errorCount++;
        console.error(`❌ 에러 발생 (행 ${insertedCount + skippedCount + errorCount}):`, error.message);
        console.error('   데이터:', row);
      }
    }

    // 트랜잭션 커밋
    await client.query('COMMIT');

    console.log('\n✅ 데이터 삽입 완료!');
    console.log('====================');
    console.log(`✅ 삽입 성공: ${insertedCount}개`);
    console.log(`⚠️  건너뜀: ${skippedCount}개`);
    console.log(`❌ 에러: ${errorCount}개`);
    console.log('====================\n');

    // 대학별 통계 출력
    const statsQuery = `
      SELECT
        university_name,
        COUNT(*) as count,
        SUM(recruitment_count) as total_recruitment,
        SUM(application_count) as total_application,
        ROUND(AVG(competition_rate), 2) as avg_rate
      FROM application_rates
      GROUP BY university_name
      ORDER BY count DESC
      LIMIT 10
    `;

    const stats = await client.query(statsQuery);
    console.log('📊 대학별 통계 (상위 10개):');
    console.table(stats.rows);

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ 전체 에러 발생:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// 스크립트 실행
console.log('🚀 수시 경쟁률 데이터 가져오기 시작\n');
console.log('사용법: node import-competition-rates.js [--delete-existing]\n');

importCompetitionRates()
  .then(() => {
    console.log('✅ 모든 작업 완료!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ 치명적 에러:', error);
    process.exit(1);
  });
