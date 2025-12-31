import { PrismaClient, SchoolLevel } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // ============================================================================
  // 1. 학년 코드
  // ============================================================================
  const schoolGrades = [
    { gradeId: 'HN', gradeName: 'N수', schoolLevel: SchoolLevel.n_su, sortOrder: 0 },
    { gradeId: 'H3', gradeName: '고3', schoolLevel: SchoolLevel.high, sortOrder: 1 },
    { gradeId: 'H2', gradeName: '고2', schoolLevel: SchoolLevel.high, sortOrder: 2 },
    { gradeId: 'H1', gradeName: '고1', schoolLevel: SchoolLevel.high, sortOrder: 3 },
    { gradeId: 'M3', gradeName: '중3', schoolLevel: SchoolLevel.middle, sortOrder: 4 },
    { gradeId: 'M2', gradeName: '중2', schoolLevel: SchoolLevel.middle, sortOrder: 5 },
    { gradeId: 'M1', gradeName: '중1', schoolLevel: SchoolLevel.middle, sortOrder: 6 },
    { gradeId: 'P6', gradeName: '초6', schoolLevel: SchoolLevel.elementary, sortOrder: 7 },
    { gradeId: 'P5', gradeName: '초5', schoolLevel: SchoolLevel.elementary, sortOrder: 8 },
    { gradeId: 'P4', gradeName: '초4', schoolLevel: SchoolLevel.elementary, sortOrder: 9 },
    { gradeId: 'P3', gradeName: '초3', schoolLevel: SchoolLevel.elementary, sortOrder: 10 },
    { gradeId: 'P2', gradeName: '초2', schoolLevel: SchoolLevel.elementary, sortOrder: 11 },
    { gradeId: 'P1', gradeName: '초1', schoolLevel: SchoolLevel.elementary, sortOrder: 12 },
  ];

  for (const grade of schoolGrades) {
    await prisma.schoolGrade.upsert({
      where: { gradeId: grade.gradeId },
      update: grade,
      create: grade,
    });
  }
  console.log('✓ School grades seeded');

  // ============================================================================
  // 2. 교육과정 연도
  // ============================================================================
  const curriculumYears = [
    { curiYearId: 15, curiYearName: '2015개정교육' },
    { curiYearId: 22, curiYearName: '2022개정교육' },
  ];

  for (const year of curriculumYears) {
    await prisma.curriculumYear.upsert({
      where: { curiYearId: year.curiYearId },
      update: year,
      create: year,
    });
  }
  console.log('✓ Curriculum years seeded');

  // ============================================================================
  // 3. 시험 유형
  // ============================================================================
  const testTypes = [
    { testTypeId: 'NS', testTypeName: '내신' },
    { testTypeId: 'SN', testTypeName: '수능' },
    { testTypeId: 'ME', testTypeName: '모의' },
    { testTypeId: 'NO', testTypeName: '논술' },
    { testTypeId: 'SM', testTypeName: '심층면접' },
    { testTypeId: 'TJ', testTypeName: '특목자사' },
  ];

  for (const type of testTypes) {
    await prisma.testType.upsert({
      where: { testTypeId: type.testTypeId },
      update: type,
      create: type,
    });
  }
  console.log('✓ Test types seeded');

  // ============================================================================
  // 4. 주요 과목 코드
  // ============================================================================
  const subjectCodesMajor = [
    { subjectMajorId: 'K1', subjectArea: '국어', subjectCode: 'K', sortOrder: 1 },
    { subjectMajorId: 'M1', subjectArea: '수학', subjectCode: 'M', sortOrder: 2 },
    { subjectMajorId: 'E1', subjectArea: '영어', subjectCode: 'E', sortOrder: 3 },
    { subjectMajorId: 'S1', subjectArea: '사회', subjectCode: 'S', sortOrder: 4 },
    { subjectMajorId: 'C1', subjectArea: '과학', subjectCode: 'C', sortOrder: 5 },
    { subjectMajorId: 'H1', subjectArea: '한국사', subjectCode: 'H', sortOrder: 6 },
  ];

  for (const subject of subjectCodesMajor) {
    await prisma.subjectCodeMajor.upsert({
      where: { subjectMajorId: subject.subjectMajorId },
      update: subject,
      create: subject,
    });
  }
  console.log('✓ Subject codes (major) seeded');

  // ============================================================================
  // 5. 세부 과목 코드 (일부 예시)
  // ============================================================================
  const subjectCodesMinor = [
    // 2015 개정 - 국어
    { subjectMinorId: 'K151', curiYearId: 15, subjectMajorId: 'K1', subjectName: '국어', sortOrder: 1 },
    { subjectMinorId: 'K152', curiYearId: 15, subjectMajorId: 'K1', subjectName: '문학', sortOrder: 2 },
    { subjectMinorId: 'K153', curiYearId: 15, subjectMajorId: 'K1', subjectName: '독서', sortOrder: 3 },
    { subjectMinorId: 'K154', curiYearId: 15, subjectMajorId: 'K1', subjectName: '화법과작문', sortOrder: 4 },
    { subjectMinorId: 'K155', curiYearId: 15, subjectMajorId: 'K1', subjectName: '언어와매체', sortOrder: 5 },
    // 2015 개정 - 수학
    { subjectMinorId: 'M151', curiYearId: 15, subjectMajorId: 'M1', subjectName: '수학', sortOrder: 1 },
    { subjectMinorId: 'M152', curiYearId: 15, subjectMajorId: 'M1', subjectName: '수학I', sortOrder: 2 },
    { subjectMinorId: 'M153', curiYearId: 15, subjectMajorId: 'M1', subjectName: '수학II', sortOrder: 3 },
    { subjectMinorId: 'M154', curiYearId: 15, subjectMajorId: 'M1', subjectName: '미적분', sortOrder: 4 },
    { subjectMinorId: 'M155', curiYearId: 15, subjectMajorId: 'M1', subjectName: '확률과통계', sortOrder: 5 },
    { subjectMinorId: 'M156', curiYearId: 15, subjectMajorId: 'M1', subjectName: '기하', sortOrder: 6 },
    // 2015 개정 - 영어
    { subjectMinorId: 'E151', curiYearId: 15, subjectMajorId: 'E1', subjectName: '영어', sortOrder: 1 },
    { subjectMinorId: 'E152', curiYearId: 15, subjectMajorId: 'E1', subjectName: '영어I', sortOrder: 2 },
    { subjectMinorId: 'E153', curiYearId: 15, subjectMajorId: 'E1', subjectName: '영어II', sortOrder: 3 },
    // 2022 개정 - 수학
    { subjectMinorId: 'M221', curiYearId: 22, subjectMajorId: 'M1', subjectName: '공통수학1', sortOrder: 1 },
    { subjectMinorId: 'M222', curiYearId: 22, subjectMajorId: 'M1', subjectName: '공통수학2', sortOrder: 2 },
    { subjectMinorId: 'M223', curiYearId: 22, subjectMajorId: 'M1', subjectName: '대수', sortOrder: 3 },
    { subjectMinorId: 'M224', curiYearId: 22, subjectMajorId: 'M1', subjectName: '미적분I', sortOrder: 4 },
    { subjectMinorId: 'M225', curiYearId: 22, subjectMajorId: 'M1', subjectName: '확률과통계', sortOrder: 5 },
  ];

  for (const subject of subjectCodesMinor) {
    await prisma.subjectCodeMinor.upsert({
      where: { subjectMinorId: subject.subjectMinorId },
      update: subject,
      create: subject,
    });
  }
  console.log('✓ Subject codes (minor) seeded');

  // ============================================================================
  // 6. 역할
  // ============================================================================
  const roles = [
    { roleId: 'R_STUDENT', roleName: '학생', roleScope: '개인', description: '학습자 역할' },
    { roleId: 'R_PARENT', roleName: '학부모', roleScope: '개인', description: '학부모 역할' },
    { roleId: 'R_TUTOR', roleName: '학습관리선생님', roleScope: '기관', description: '학습 관리 및 지도' },
    { roleId: 'R_EDITOR', roleName: '에디터', roleScope: '기관', description: '문제 편집 및 검수' },
    { roleId: 'R_CHIEF_EDITOR', roleName: '수석에디터', roleScope: '기관', description: '에디터 관리 및 최종 검수' },
    { roleId: 'R_ADMIN', roleName: '관리자', roleScope: '시스템', description: '시스템 관리자' },
    { roleId: 'R_SALES', roleName: '영업', roleScope: '기관', description: '영업 담당' },
    { roleId: 'R_AGENCY', roleName: '대행사', roleScope: '기관', description: '대행사 역할' },
    { roleId: 'R_ACADEMY', roleName: '학원', roleScope: '기관', description: '학원 관리자' },
    { roleId: 'R_CS', roleName: '고객서비스', roleScope: '시스템', description: '고객 지원' },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { roleId: role.roleId },
      update: role,
      create: role,
    });
  }
  console.log('✓ Roles seeded');

  // ============================================================================
  // 7. 권한
  // ============================================================================
  const permissions = [
    // 문제 관련
    { permId: 'problems:read', permName: '문제 조회', category: '문제' },
    { permId: 'problems:create', permName: '문제 생성', category: '문제' },
    { permId: 'problems:update', permName: '문제 수정', category: '문제' },
    { permId: 'problems:delete', permName: '문제 삭제', category: '문제' },
    { permId: 'problems:review', permName: '문제 검수', category: '문제' },
    // 시험지 관련
    { permId: 'papers:read', permName: '시험지 조회', category: '시험지' },
    { permId: 'papers:create', permName: '시험지 생성', category: '시험지' },
    { permId: 'papers:update', permName: '시험지 수정', category: '시험지' },
    { permId: 'papers:delete', permName: '시험지 삭제', category: '시험지' },
    // 사용자 관련
    { permId: 'users:read', permName: '사용자 조회', category: '사용자' },
    { permId: 'users:create', permName: '사용자 생성', category: '사용자' },
    { permId: 'users:update', permName: '사용자 수정', category: '사용자' },
    { permId: 'users:delete', permName: '사용자 삭제', category: '사용자' },
    // 관리자
    { permId: 'admin:access', permName: '관리자 접근', category: '관리' },
    { permId: 'admin:settings', permName: '설정 관리', category: '관리' },
    // 보고서
    { permId: 'reports:read', permName: '보고서 조회', category: '보고서' },
    { permId: 'reports:export', permName: '보고서 내보내기', category: '보고서' },
  ];

  for (const perm of permissions) {
    await prisma.permission.upsert({
      where: { permId: perm.permId },
      update: perm,
      create: perm,
    });
  }
  console.log('✓ Permissions seeded');

  // ============================================================================
  // 8. 역할-권한 매핑
  // ============================================================================
  const rolePermissions = [
    // 학생 권한
    { roleId: 'R_STUDENT', permId: 'problems:read' },
    { roleId: 'R_STUDENT', permId: 'papers:read' },
    // 교사 권한
    { roleId: 'R_TUTOR', permId: 'problems:read' },
    { roleId: 'R_TUTOR', permId: 'problems:create' },
    { roleId: 'R_TUTOR', permId: 'papers:read' },
    { roleId: 'R_TUTOR', permId: 'papers:create' },
    { roleId: 'R_TUTOR', permId: 'papers:update' },
    { roleId: 'R_TUTOR', permId: 'users:read' },
    { roleId: 'R_TUTOR', permId: 'reports:read' },
    // 에디터 권한
    { roleId: 'R_EDITOR', permId: 'problems:read' },
    { roleId: 'R_EDITOR', permId: 'problems:create' },
    { roleId: 'R_EDITOR', permId: 'problems:update' },
    { roleId: 'R_EDITOR', permId: 'papers:read' },
    { roleId: 'R_EDITOR', permId: 'papers:create' },
    // 수석에디터 권한
    { roleId: 'R_CHIEF_EDITOR', permId: 'problems:read' },
    { roleId: 'R_CHIEF_EDITOR', permId: 'problems:create' },
    { roleId: 'R_CHIEF_EDITOR', permId: 'problems:update' },
    { roleId: 'R_CHIEF_EDITOR', permId: 'problems:delete' },
    { roleId: 'R_CHIEF_EDITOR', permId: 'problems:review' },
    { roleId: 'R_CHIEF_EDITOR', permId: 'papers:read' },
    { roleId: 'R_CHIEF_EDITOR', permId: 'papers:create' },
    { roleId: 'R_CHIEF_EDITOR', permId: 'papers:update' },
    { roleId: 'R_CHIEF_EDITOR', permId: 'papers:delete' },
    // 관리자 권한 (모든 권한)
    ...permissions.map((p) => ({ roleId: 'R_ADMIN', permId: p.permId })),
  ];

  for (const rp of rolePermissions) {
    await prisma.rolePermission.upsert({
      where: { roleId_permId: { roleId: rp.roleId, permId: rp.permId } },
      update: rp,
      create: rp,
    });
  }
  console.log('✓ Role permissions seeded');

  // ============================================================================
  // 9. 시험 출처
  // ============================================================================
  const testSources = [
    {
      testTypeId: 'NS',
      sourceCode: 'NS',
      exampleId: 'NSH0001M12411M',
      idFormat: 'NS+학교코드(5)+과목(2)+년도(2)+학년(1)+학기(1)+시기(1)',
      description: '내신 기출문제',
    },
    {
      testTypeId: 'SN',
      sourceCode: 'SN',
      exampleId: 'SNM32003',
      idFormat: 'SN+과목코드(2)+년도(4)',
      description: '수능 기출문제',
    },
    {
      testTypeId: 'ME',
      sourceCode: 'ME',
      exampleId: 'MEM124306',
      idFormat: 'ME+과목코드(2)+년도(2)+학년(1)+월(2)',
      description: '모의고사 기출문제',
    },
    {
      testTypeId: 'NO',
      sourceCode: 'NO',
      exampleId: 'NSU001M1240',
      idFormat: 'NS+대학코드(4)+과목(2)+년도(2)+시기(1)',
      description: '논술 기출문제',
    },
    {
      testTypeId: 'SM',
      sourceCode: 'SM',
      exampleId: 'SMU001M1230',
      idFormat: 'SM+대학코드(4)+과목(2)+년도(2)+시기(1)',
      description: '심층면접 기출문제',
    },
    {
      testTypeId: 'TJ',
      sourceCode: 'TJ',
      exampleId: 'TJH0012M12440',
      idFormat: 'TJ+학교코드(5)+과목(2)+년도(2)+시기(1)',
      description: '특목자사 기출문제',
    },
  ];

  for (const source of testSources) {
    await prisma.testSource.upsert({
      where: { sourceCode: source.sourceCode },
      update: source,
      create: source,
    });
  }
  console.log('✓ Test sources seeded');

  console.log('\n✅ Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
