const XLSX = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, 'uploads', '교과 학종 out 240823.xlsx');

console.log('Excel 파일 경로:', excelPath);

try {
  const workbook = XLSX.readFile(excelPath);
  console.log('\n사용 가능한 시트:', workbook.SheetNames);

  // 교과 시트 확인
  const sheetName = workbook.SheetNames.find(name => name.includes('교과'));

  if (sheetName) {
    console.log(`\n"${sheetName}" 시트 확인 중...`);
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    // 헤더 확인 (첫 번째 행)
    console.log('\n전체 헤더 확인:');
    const headers = data[0];
    console.log('헤더 배열:', headers);

    // 각 헤더를 인덱스와 함께 출력
    headers.forEach((header, idx) => {
      if (header && header.toString().trim()) {
        console.log(`  [${idx}] ${header}`);
      }
    });

    // df, de 컬럼 찾기
    const dfIndex = headers.findIndex(h => h === 'df');
    const deIndex = headers.findIndex(h => h === 'de');

    console.log(`\ndf 컬럼 인덱스: ${dfIndex}`);
    console.log(`de 컬럼 인덱스: ${deIndex}`);

    // 샘플 데이터 확인 (첫 5개 행)
    if (dfIndex !== -1 && deIndex !== -1) {
      console.log('\n샘플 데이터 (첫 5개 행):');
      for (let i = 1; i <= Math.min(5, data.length - 1); i++) {
        const row = data[i];
        console.log(`행 ${i}:`);
        console.log(`  통합ID: ${row[0] || 'N/A'}`);
        console.log(`  대학명: ${row[2] || 'N/A'}`);
        console.log(`  모집단위: ${row[7] || 'N/A'}`);
        console.log(`  df (50%컷): ${row[dfIndex] || 'N/A'}`);
        console.log(`  de (70%컷): ${row[deIndex] || 'N/A'}`);
      }
    }

    console.log(`\n총 데이터 행 수: ${data.length - 1}`);
  } else {
    console.log('\n"교과" 시트를 찾을 수 없습니다.');
  }
} catch (error) {
  console.error('에러 발생:', error.message);
}
