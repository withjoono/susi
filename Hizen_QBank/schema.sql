-- ============================================================================
-- 문제은행 플랫폼 Database Schema
-- Generated from: 문제은행_플랫폼_수정.xlsx
-- Database: MySQL 8.0+
-- ============================================================================

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- ============================================================================
-- 1. 기초 코드 테이블 (Lookup Tables)
-- ============================================================================

-- 학년 코드
CREATE TABLE school_grades (
    grade_id VARCHAR(5) PRIMARY KEY COMMENT '학년 코드 (H1, H2, H3, M1-M3, P1-P6, HN)',
    grade_name VARCHAR(20) NOT NULL COMMENT '학년명 (고1, 고2, 고3, 중1-중3, 초1-초6, N수)',
    school_level ENUM('초등', '중등', '고등', 'N수') NOT NULL COMMENT '학교급',
    sort_order INT DEFAULT 0 COMMENT '정렬 순서'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='학년 코드 테이블';

-- 교육과정 연도
CREATE TABLE curriculum_years (
    curi_year_id INT PRIMARY KEY COMMENT '교육과정 ID (15, 22)',
    curi_year_name VARCHAR(20) NOT NULL COMMENT '교육과정명 (2015개정교육, 2022개정교육)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='교육과정 연도';

-- 주요 과목 코드
CREATE TABLE subject_codes_major (
    subject_major_id VARCHAR(5) PRIMARY KEY COMMENT '과목 대분류 ID (K1, M1, E1 등)',
    subject_area VARCHAR(20) NOT NULL COMMENT '과목 영역 (국어, 수학, 영어 등)',
    subject_code CHAR(1) NOT NULL COMMENT '과목 코드 (K, M, E 등)',
    sort_order INT DEFAULT 1 COMMENT '정렬 순서'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='과목 대분류';

-- 세부 과목 코드
CREATE TABLE subject_codes_minor (
    subject_minor_id VARCHAR(10) PRIMARY KEY COMMENT '과목 소분류 ID (K151, M221 등)',
    curi_year_id INT NOT NULL COMMENT '교육과정 연도 FK',
    subject_major_id VARCHAR(5) NOT NULL COMMENT '과목 대분류 FK',
    subject_name VARCHAR(50) NOT NULL COMMENT '세부 과목명',
    sort_order INT DEFAULT 1 COMMENT '정렬 순서',
    FOREIGN KEY (curi_year_id) REFERENCES curriculum_years(curi_year_id),
    FOREIGN KEY (subject_major_id) REFERENCES subject_codes_major(subject_major_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='과목 소분류';

-- 시험 유형
CREATE TABLE test_types (
    test_type_id VARCHAR(5) PRIMARY KEY COMMENT '시험 유형 ID (NS, SN, ME 등)',
    test_type_name VARCHAR(20) NOT NULL COMMENT '시험 유형명 (내신, 수능, 모의 등)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='시험 유형';

-- 시험 출처
CREATE TABLE test_sources (
    source_id INT AUTO_INCREMENT PRIMARY KEY,
    test_type_id VARCHAR(5) NOT NULL COMMENT '시험 유형 FK',
    source_code VARCHAR(20) NOT NULL COMMENT '출처 코드',
    example_id VARCHAR(30) COMMENT '예시 ID 형식',
    id_format VARCHAR(100) COMMENT 'ID 형식 설명',
    description TEXT COMMENT '설명',
    FOREIGN KEY (test_type_id) REFERENCES test_types(test_type_id),
    UNIQUE KEY uk_source_code (source_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='시험 출처';

-- 고등학교 코드
CREATE TABLE highschools (
    school_id VARCHAR(10) PRIMARY KEY COMMENT '학교 ID (H0001~)',
    school_category VARCHAR(20) COMMENT '학교구분명 (일반고등학교 등)',
    school_type VARCHAR(20) COMMENT '설립유형 (일반고, 특목고 등)',
    region_city VARCHAR(20) COMMENT '시도',
    region_district VARCHAR(20) COMMENT '시군구',
    education_office VARCHAR(20) COMMENT '지역교육청',
    school_name VARCHAR(100) NOT NULL COMMENT '학교명',
    school_level VARCHAR(20) COMMENT '학교급',
    day_night VARCHAR(10) COMMENT '주야구분',
    gender VARCHAR(10) COMMENT '성별구분',
    founding_type VARCHAR(20) COMMENT '설립구분',
    postal_code VARCHAR(10) COMMENT '우편번호',
    address VARCHAR(255) COMMENT '도로명주소',
    phone VARCHAR(20) COMMENT '전화번호',
    fax VARCHAR(20) COMMENT '팩스번호',
    website VARCHAR(255) COMMENT '홈페이지'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='고등학교 정보';

-- 대학교 코드
CREATE TABLE universities (
    univ_id VARCHAR(10) PRIMARY KEY COMMENT '대학 ID (U001~)',
    univ_name VARCHAR(100) NOT NULL COMMENT '대학명',
    univ_name_alias VARCHAR(100) COMMENT '대학 별칭',
    region VARCHAR(20) COMMENT '소재지역'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='대학교 정보';

-- 출판사
CREATE TABLE publishers (
    publisher_id INT AUTO_INCREMENT PRIMARY KEY,
    publisher_name VARCHAR(100) NOT NULL COMMENT '출판사명',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='출판사';

-- 출판사 저자
CREATE TABLE publisher_authors (
    author_id INT AUTO_INCREMENT PRIMARY KEY,
    publisher_id INT NOT NULL COMMENT '출판사 FK',
    author_name VARCHAR(100) NOT NULL COMMENT '저자명',
    subject_minor_id VARCHAR(10) COMMENT '담당 과목',
    FOREIGN KEY (publisher_id) REFERENCES publishers(publisher_id),
    FOREIGN KEY (subject_minor_id) REFERENCES subject_codes_minor(subject_minor_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='출판사 저자';

-- ============================================================================
-- 2. 역할 및 권한 테이블 (RBAC)
-- ============================================================================

-- 역할 정의
CREATE TABLE roles (
    role_id VARCHAR(20) PRIMARY KEY COMMENT '역할 ID (R_STUDENT, R_TUTOR 등)',
    role_name VARCHAR(50) NOT NULL COMMENT '역할명 (학생, 학습관리선생님 등)',
    role_scope VARCHAR(20) COMMENT '역할 범위 (개인/학원/기관 등)',
    description TEXT COMMENT '역할 설명',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='역할 정의';

-- 권한 정의
CREATE TABLE permissions (
    perm_id VARCHAR(50) PRIMARY KEY COMMENT '권한 ID (problems:create 등)',
    perm_name VARCHAR(100) NOT NULL COMMENT '권한명',
    category VARCHAR(50) COMMENT '권한 분류 (문제/시험지 등)',
    description TEXT COMMENT '권한 설명',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='권한 정의';

-- 역할-권한 매핑
CREATE TABLE role_permissions (
    role_id VARCHAR(20) NOT NULL,
    perm_id VARCHAR(50) NOT NULL,
    granted_by VARCHAR(36) COMMENT '권한 부여자 user_id',
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (role_id, perm_id),
    FOREIGN KEY (role_id) REFERENCES roles(role_id),
    FOREIGN KEY (perm_id) REFERENCES permissions(perm_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='역할-권한 매핑';

-- ============================================================================
-- 3. 사용자 테이블
-- ============================================================================

-- 통합 사용자 테이블
CREATE TABLE users (
    user_id VARCHAR(36) PRIMARY KEY COMMENT '사용자 ID (ST1, PA1, TE1 등)',
    email VARCHAR(255) NOT NULL UNIQUE COMMENT '이메일 (로그인 ID)',
    password_hash VARCHAR(255) NOT NULL COMMENT '비밀번호 (bcrypt)',
    name VARCHAR(100) NOT NULL COMMENT '실명',
    phone VARCHAR(20) COMMENT '연락처',

    -- 역할 유형
    user_type ENUM('ST', 'PA', 'TE', 'ED', 'CE', 'AD', 'SA', 'AG', 'AC', 'CS') NOT NULL
        COMMENT 'ST=학생, PA=학부모, TE=학습관리선생님, ED=에디터, CE=수석에디터, AD=관리자, SA=영업, AG=대행사, AC=학원, CS=고객서비스',

    -- 학생 전용 필드
    school_name VARCHAR(255) COMMENT '학교명 (학생용)',
    school_id VARCHAR(10) COMMENT '학교코드 FK (학생용)',
    grade_id VARCHAR(5) COMMENT '학년 FK',
    enrollment_year INT COMMENT '입학연도',
    school_type VARCHAR(20) COMMENT '학교유형 (일반고, 자사고, 특목고 등)',

    -- 학부모 전용 필드
    child_user_id VARCHAR(36) COMMENT '자녀 user_id FK (학부모용)',

    -- 교사/에디터 전용 필드
    specialization JSON COMMENT '전문 분야 ["K1", "M1"] (교사/에디터용)',
    organization VARCHAR(100) COMMENT '소속 (학원명, 기관명 등)',

    -- 공통 상태 필드
    verification_status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending' COMMENT '인증 상태',
    is_active BOOLEAN DEFAULT TRUE COMMENT '활성화 상태',

    -- 마케팅/분석 필드
    marketing_consent BOOLEAN DEFAULT FALSE COMMENT '마케팅 정보 수신 동의',
    referral_source VARCHAR(100) COMMENT '가입 경로',
    special_notes TEXT COMMENT '특이사항 메모',

    -- 로그인 추적
    last_login TIMESTAMP NULL COMMENT '마지막 로그인',
    login_count INT DEFAULT 0 COMMENT '총 로그인 횟수',

    -- 타임스탬프
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (grade_id) REFERENCES school_grades(grade_id),
    FOREIGN KEY (school_id) REFERENCES highschools(school_id),
    INDEX idx_user_type (user_type),
    INDEX idx_email (email),
    INDEX idx_school (school_id),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='통합 사용자 테이블';

-- 사용자-역할 매핑
CREATE TABLE user_roles (
    user_id VARCHAR(36) NOT NULL,
    role_id VARCHAR(20) NOT NULL,
    assigned_by VARCHAR(36) COMMENT '역할 부여자',
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL COMMENT '만료일 (임시 권한용)',
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (role_id) REFERENCES roles(role_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='사용자-역할 매핑';

-- 교사-학생 관계
CREATE TABLE tutor_students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tutor_id VARCHAR(36) NOT NULL COMMENT '교사 user_id',
    student_id VARCHAR(36) NOT NULL COMMENT '학생 user_id',
    relationship_type ENUM('direct', 'academy', 'online') DEFAULT 'direct' COMMENT '관계 유형',
    status ENUM('active', 'inactive', 'pending') DEFAULT 'pending',
    start_date DATE COMMENT '관계 시작일',
    end_date DATE COMMENT '관계 종료일',
    notes TEXT COMMENT '메모',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tutor_id) REFERENCES users(user_id),
    FOREIGN KEY (student_id) REFERENCES users(user_id),
    UNIQUE KEY uk_tutor_student (tutor_id, student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='교사-학생 관계';

-- ============================================================================
-- 4. 문제 테이블
-- ============================================================================

-- 기출문제 (내신, 수능, 모의고사, 논술, 심층면접, 특목자사 통합)
CREATE TABLE problems_reference (
    problem_id VARCHAR(36) PRIMARY KEY COMMENT '문제 ID (형식: 시험유형+코드)',

    -- 시험 정보
    test_type_id VARCHAR(5) NOT NULL COMMENT '시험 유형 FK (NS, SN, ME 등)',
    exam_type ENUM('내신', '수능', '모의', '심층면접', '특목자', '자사고', '논술') NOT NULL COMMENT '시험 종류',

    -- 출처 정보
    school_id VARCHAR(10) COMMENT '학교 코드 FK (내신/특목자사용)',
    univ_id VARCHAR(10) COMMENT '대학 코드 FK (논술/심층면접용)',
    year SMALLINT NOT NULL COMMENT '출제 연도',
    grade_id VARCHAR(5) COMMENT '학년 FK',
    semester ENUM('1학기', '2학기') COMMENT '학기 (내신용)',
    exam_period VARCHAR(50) COMMENT '시험 시기 (중간/기말/모의고사월)',

    -- 과목 정보
    subject_major_id VARCHAR(5) NOT NULL COMMENT '과목 대분류 FK',
    subject_minor_id VARCHAR(10) COMMENT '과목 소분류 FK',

    -- 단원 정보
    large_unit VARCHAR(255) COMMENT '대단원',
    medium_unit VARCHAR(255) COMMENT '중단원',
    small_unit VARCHAR(255) COMMENT '소단원',

    -- 문제 내용
    problem_number SMALLINT COMMENT '문제 번호',
    problem_text TEXT NOT NULL COMMENT '문제 본문 (LaTeX 지원)',
    problem_image_url VARCHAR(500) COMMENT '문제 이미지 URL',
    problem_image_keywords JSON COMMENT '이미지 키워드 (AI 분석용)',
    has_table BOOLEAN DEFAULT FALSE COMMENT '표 포함 여부',
    table_keywords JSON COMMENT '표 키워드',
    passage_text TEXT COMMENT '지문 (국어/영어용)',

    -- 선택지 및 정답
    choices JSON COMMENT '선지 {"1": "...", "2": "...", ...}',
    answer TEXT NOT NULL COMMENT '정답',
    solution LONGTEXT COMMENT '해설',

    -- 문제 속성
    question_type ENUM('객관식', '주관식', '서술형') NOT NULL COMMENT '문제 유형',
    difficulty ENUM('매우쉬움', '쉬움', '보통', '어려움', '킬러') DEFAULT '보통' COMMENT '난이도',
    score INT DEFAULT 1 COMMENT '배점',

    -- AI 분석 필드
    thinking_pattern VARCHAR(255) COMMENT '사고 유형 패턴',
    keywords JSON COMMENT '검색용 키워드',

    -- 관리 필드
    source_file VARCHAR(500) COMMENT '원본 파일 경로',
    uploader_id VARCHAR(36) COMMENT '업로더 user_id',
    status ENUM('검수대기', '승인', '반려') DEFAULT '검수대기' COMMENT '검수 상태',
    reviewer_id VARCHAR(36) COMMENT '검수자 user_id',
    reviewed_at TIMESTAMP NULL COMMENT '검수 일시',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (test_type_id) REFERENCES test_types(test_type_id),
    FOREIGN KEY (school_id) REFERENCES highschools(school_id),
    FOREIGN KEY (univ_id) REFERENCES universities(univ_id),
    FOREIGN KEY (grade_id) REFERENCES school_grades(grade_id),
    FOREIGN KEY (subject_major_id) REFERENCES subject_codes_major(subject_major_id),
    FOREIGN KEY (subject_minor_id) REFERENCES subject_codes_minor(subject_minor_id),
    FOREIGN KEY (uploader_id) REFERENCES users(user_id),
    FOREIGN KEY (reviewer_id) REFERENCES users(user_id),

    INDEX idx_test_type (test_type_id),
    INDEX idx_subject (subject_major_id, subject_minor_id),
    INDEX idx_year (year),
    INDEX idx_difficulty (difficulty),
    INDEX idx_status (status),
    FULLTEXT INDEX ft_problem_text (problem_text, solution)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='기출문제';

-- AI 생성 문제
CREATE TABLE problems_generated (
    problem_id VARCHAR(36) PRIMARY KEY COMMENT 'UUID',

    -- 생성 정보
    creator_id VARCHAR(36) NOT NULL COMMENT '생성 요청자 user_id',
    generation_prompt TEXT COMMENT 'RAG 생성 프롬프트',
    base_problem_id VARCHAR(36) COMMENT '참조 기출문제 ID (변형 문제용)',

    -- 과목 정보
    subject_major_id VARCHAR(5) NOT NULL COMMENT '과목 대분류 FK',
    subject_minor_id VARCHAR(10) COMMENT '과목 소분류 FK',

    -- 단원 정보
    large_unit VARCHAR(255) COMMENT '대단원',
    medium_unit VARCHAR(255) COMMENT '중단원',
    small_unit VARCHAR(255) COMMENT '소단원',

    -- 문제 내용
    problem_text TEXT NOT NULL COMMENT '문제 본문',
    problem_image_url VARCHAR(500) COMMENT '문제 이미지 URL',
    choices JSON COMMENT '선지',
    answer TEXT NOT NULL COMMENT '정답',
    solution LONGTEXT COMMENT '해설',

    -- 문제 속성
    question_type ENUM('객관식', '주관식', '서술형') NOT NULL,
    difficulty ENUM('매우쉬움', '쉬움', '보통', '어려움', '킬러') DEFAULT '보통',
    target_grade_id VARCHAR(5) COMMENT '대상 학년',

    -- AI 분석 필드
    thinking_pattern VARCHAR(255) COMMENT '사고 유형',
    keywords JSON COMMENT '키워드',
    ai_model VARCHAR(50) COMMENT '사용된 AI 모델',
    generation_params JSON COMMENT '생성 파라미터',

    -- 품질 관리
    quality_score DECIMAL(3,2) COMMENT 'AI 품질 점수 (0.00-1.00)',
    status ENUM('생성됨', '검수대기', '승인', '반려') DEFAULT '생성됨',
    reviewer_id VARCHAR(36) COMMENT '검수자',
    reviewed_at TIMESTAMP NULL,
    rejection_reason TEXT COMMENT '반려 사유',

    -- 사용 통계
    use_count INT DEFAULT 0 COMMENT '시험지 사용 횟수',
    rating_avg DECIMAL(2,1) DEFAULT 0.0 COMMENT '평균 평점',
    rating_count INT DEFAULT 0 COMMENT '평점 수',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (creator_id) REFERENCES users(user_id),
    FOREIGN KEY (base_problem_id) REFERENCES problems_reference(problem_id),
    FOREIGN KEY (subject_major_id) REFERENCES subject_codes_major(subject_major_id),
    FOREIGN KEY (subject_minor_id) REFERENCES subject_codes_minor(subject_minor_id),
    FOREIGN KEY (target_grade_id) REFERENCES school_grades(grade_id),

    INDEX idx_creator (creator_id),
    INDEX idx_subject (subject_major_id, subject_minor_id),
    INDEX idx_status (status),
    INDEX idx_quality (quality_score)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='AI 생성 문제';

-- ============================================================================
-- 5. 시험지 테이블
-- ============================================================================

-- 시험지
CREATE TABLE papers (
    paper_id VARCHAR(36) PRIMARY KEY COMMENT 'UUID',
    creator_id VARCHAR(36) NOT NULL COMMENT '작성자 user_id',

    -- 시험지 정보
    title VARCHAR(255) NOT NULL COMMENT '시험지 제목',
    description TEXT COMMENT '설명',
    paper_type ENUM('내신대비', '수능대비', '모의고사', '과제', '자체제작') NOT NULL,

    -- 대상 정보
    target_grade_id VARCHAR(5) COMMENT '대상 학년',
    subject_major_id VARCHAR(5) NOT NULL COMMENT '과목 대분류',
    subject_minor_id VARCHAR(10) COMMENT '과목 소분류',

    -- 시험 설정
    time_limit INT COMMENT '제한 시간 (분)',
    total_score INT DEFAULT 100 COMMENT '총점',
    passing_score INT COMMENT '합격 점수',
    shuffle_questions BOOLEAN DEFAULT FALSE COMMENT '문제 순서 섞기',
    shuffle_choices BOOLEAN DEFAULT FALSE COMMENT '선지 순서 섞기',
    show_answer_after ENUM('immediate', 'submit', 'deadline', 'manual') DEFAULT 'submit',

    -- 공개 설정
    is_public BOOLEAN DEFAULT FALSE COMMENT '공개 여부',
    access_code VARCHAR(20) COMMENT '접근 코드 (비공개 시험용)',

    -- 상태
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    published_at TIMESTAMP NULL,

    -- 통계
    attempt_count INT DEFAULT 0 COMMENT '응시 횟수',
    avg_score DECIMAL(5,2) COMMENT '평균 점수',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (creator_id) REFERENCES users(user_id),
    FOREIGN KEY (target_grade_id) REFERENCES school_grades(grade_id),
    FOREIGN KEY (subject_major_id) REFERENCES subject_codes_major(subject_major_id),
    FOREIGN KEY (subject_minor_id) REFERENCES subject_codes_minor(subject_minor_id),

    INDEX idx_creator (creator_id),
    INDEX idx_status (status),
    INDEX idx_public (is_public)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='시험지';

-- 시험지-문제 매핑
CREATE TABLE paper_problems (
    id INT AUTO_INCREMENT PRIMARY KEY,
    paper_id VARCHAR(36) NOT NULL,
    problem_type ENUM('reference', 'generated') NOT NULL COMMENT '문제 출처',
    problem_id VARCHAR(36) NOT NULL COMMENT '문제 ID',
    question_number INT NOT NULL COMMENT '문제 번호',
    score INT DEFAULT 1 COMMENT '배점',

    FOREIGN KEY (paper_id) REFERENCES papers(paper_id) ON DELETE CASCADE,
    UNIQUE KEY uk_paper_question (paper_id, question_number),
    INDEX idx_problem (problem_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='시험지-문제 매핑';

-- ============================================================================
-- 6. 시험 응시 테이블
-- ============================================================================

-- 시험 응시
CREATE TABLE exam_attempts (
    attempt_id VARCHAR(36) PRIMARY KEY COMMENT 'UUID',
    student_id VARCHAR(36) NOT NULL COMMENT '응시자 user_id',
    paper_id VARCHAR(36) NOT NULL COMMENT '시험지 ID',

    -- 응시 정보
    started_at TIMESTAMP NOT NULL COMMENT '시작 시간',
    submitted_at TIMESTAMP NULL COMMENT '제출 시간',
    time_spent INT COMMENT '소요 시간 (초)',

    -- 결과
    score DECIMAL(5,2) COMMENT '획득 점수',
    total_score INT COMMENT '총점',
    percentage DECIMAL(5,2) COMMENT '득점률',
    ranking INT COMMENT '순위',

    -- 상태
    status ENUM('in_progress', 'submitted', 'graded', 'expired') DEFAULT 'in_progress',
    is_late BOOLEAN DEFAULT FALSE COMMENT '지각 제출 여부',

    -- 부정행위 감지
    tab_switch_count INT DEFAULT 0 COMMENT '탭 전환 횟수',
    copy_paste_count INT DEFAULT 0 COMMENT '복사/붙여넣기 횟수',
    suspicious_activity JSON COMMENT '의심 활동 로그',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (student_id) REFERENCES users(user_id),
    FOREIGN KEY (paper_id) REFERENCES papers(paper_id),
    INDEX idx_student (student_id),
    INDEX idx_paper (paper_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='시험 응시';

-- 문제별 답안
CREATE TABLE exam_answers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    attempt_id VARCHAR(36) NOT NULL,
    paper_problem_id INT NOT NULL COMMENT 'paper_problems.id',

    -- 답안
    student_answer TEXT COMMENT '학생 답안',
    is_correct BOOLEAN COMMENT '정답 여부',
    score_earned DECIMAL(5,2) COMMENT '획득 점수',

    -- 서술형 채점 (선생님/AI)
    grader_id VARCHAR(36) COMMENT '채점자 user_id',
    grader_feedback TEXT COMMENT '채점 피드백',
    graded_at TIMESTAMP NULL,

    -- 메타
    time_spent INT COMMENT '해당 문제 소요 시간 (초)',
    answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (attempt_id) REFERENCES exam_attempts(attempt_id) ON DELETE CASCADE,
    FOREIGN KEY (paper_problem_id) REFERENCES paper_problems(id),
    INDEX idx_attempt (attempt_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='문제별 답안';

-- ============================================================================
-- 7. 결제/크레딧 테이블
-- ============================================================================

-- 거래 내역
CREATE TABLE transactions (
    transaction_id VARCHAR(36) PRIMARY KEY COMMENT 'UUID',
    user_id VARCHAR(36) NOT NULL COMMENT '사용자 ID',

    -- 거래 정보
    transaction_type ENUM('purchase', 'use', 'refund', 'bonus', 'expire') NOT NULL COMMENT '거래 유형',
    amount INT NOT NULL COMMENT '거래량 (양수=획득, 음수=사용)',
    balance_after INT NOT NULL COMMENT '거래 후 잔액',

    -- 결제 정보 (purchase 시)
    payment_method VARCHAR(50) COMMENT '결제 수단',
    payment_amount DECIMAL(10,2) COMMENT '결제 금액',
    payment_status ENUM('pending', 'completed', 'failed', 'refunded') COMMENT '결제 상태',
    pg_transaction_id VARCHAR(100) COMMENT 'PG사 거래 ID',

    -- 사용 정보 (use 시)
    used_for ENUM('paper_create', 'ai_generate', 'download', 'subscription') COMMENT '사용 용도',
    reference_id VARCHAR(36) COMMENT '관련 ID (paper_id, problem_id 등)',

    description VARCHAR(255) COMMENT '거래 설명',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(user_id),
    INDEX idx_user (user_id),
    INDEX idx_type (transaction_type),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='거래 내역';

-- 구독
CREATE TABLE subscriptions (
    subscription_id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,

    -- 구독 정보
    plan_type ENUM('free', 'basic', 'premium', 'enterprise') NOT NULL,
    plan_name VARCHAR(100) NOT NULL,

    -- 기간
    started_at TIMESTAMP NOT NULL,
    expires_at TIMESTAMP NOT NULL,

    -- 상태
    status ENUM('active', 'cancelled', 'expired', 'suspended') DEFAULT 'active',
    auto_renew BOOLEAN DEFAULT TRUE,

    -- 결제
    price DECIMAL(10,2),
    billing_cycle ENUM('monthly', 'yearly'),
    next_billing_at TIMESTAMP NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(user_id),
    INDEX idx_user (user_id),
    INDEX idx_status (status),
    INDEX idx_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='구독';

-- ============================================================================
-- 8. 학습 콘텐츠 테이블
-- ============================================================================

-- 동영상
CREATE TABLE videos (
    video_id VARCHAR(36) PRIMARY KEY,
    creator_id VARCHAR(36) NOT NULL,

    -- 동영상 정보
    title VARCHAR(255) NOT NULL,
    description TEXT,
    video_url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    duration INT COMMENT '재생 시간 (초)',

    -- 분류
    subject_major_id VARCHAR(5),
    subject_minor_id VARCHAR(10),
    target_grade_id VARCHAR(5),

    -- 관련 문제
    related_problem_id VARCHAR(36) COMMENT '관련 문제 ID',

    -- 통계
    view_count INT DEFAULT 0,
    like_count INT DEFAULT 0,

    -- 상태
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    is_public BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (creator_id) REFERENCES users(user_id),
    FOREIGN KEY (subject_major_id) REFERENCES subject_codes_major(subject_major_id),
    FOREIGN KEY (subject_minor_id) REFERENCES subject_codes_minor(subject_minor_id),
    FOREIGN KEY (target_grade_id) REFERENCES school_grades(grade_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='동영상';

-- 과제
CREATE TABLE assignments (
    assignment_id VARCHAR(36) PRIMARY KEY,
    creator_id VARCHAR(36) NOT NULL COMMENT '출제자 (교사)',

    -- 과제 정보
    title VARCHAR(255) NOT NULL,
    description TEXT,
    paper_id VARCHAR(36) COMMENT '연결된 시험지',

    -- 기한
    start_date TIMESTAMP NOT NULL,
    due_date TIMESTAMP NOT NULL,
    late_submission_allowed BOOLEAN DEFAULT FALSE,
    late_penalty_percent INT DEFAULT 0,

    -- 대상
    target_type ENUM('individual', 'class', 'all') DEFAULT 'individual',
    target_user_ids JSON COMMENT '대상 학생 ID 목록',

    -- 상태
    status ENUM('draft', 'published', 'closed') DEFAULT 'draft',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (creator_id) REFERENCES users(user_id),
    FOREIGN KEY (paper_id) REFERENCES papers(paper_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='과제';

-- ============================================================================
-- 9. 커뮤니케이션 테이블
-- ============================================================================

-- 채팅방
CREATE TABLE chats (
    chat_id VARCHAR(36) PRIMARY KEY,
    chat_type ENUM('direct', 'group', 'support') NOT NULL,
    name VARCHAR(100) COMMENT '채팅방 이름 (그룹용)',

    created_by VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (created_by) REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='채팅방';

-- 채팅 참여자
CREATE TABLE chat_participants (
    chat_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_read_at TIMESTAMP NULL,
    is_admin BOOLEAN DEFAULT FALSE,

    PRIMARY KEY (chat_id, user_id),
    FOREIGN KEY (chat_id) REFERENCES chats(chat_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='채팅 참여자';

-- 메시지
CREATE TABLE messages (
    message_id VARCHAR(36) PRIMARY KEY,
    chat_id VARCHAR(36) NOT NULL,
    sender_id VARCHAR(36) NOT NULL,

    content TEXT NOT NULL,
    message_type ENUM('text', 'image', 'file', 'system') DEFAULT 'text',
    file_url VARCHAR(500) COMMENT '첨부 파일 URL',

    is_edited BOOLEAN DEFAULT FALSE,
    edited_at TIMESTAMP NULL,
    is_deleted BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (chat_id) REFERENCES chats(chat_id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(user_id),
    INDEX idx_chat (chat_id),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='메시지';

-- 알림
CREATE TABLE notifications (
    notification_id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,

    -- 알림 내용
    title VARCHAR(255) NOT NULL,
    content TEXT,
    notification_type ENUM('system', 'assignment', 'grade', 'message', 'payment', 'promotion') NOT NULL,

    -- 링크
    action_url VARCHAR(500) COMMENT '클릭 시 이동 URL',
    reference_type VARCHAR(50) COMMENT '관련 엔티티 타입',
    reference_id VARCHAR(36) COMMENT '관련 엔티티 ID',

    -- 상태
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL,

    FOREIGN KEY (user_id) REFERENCES users(user_id),
    INDEX idx_user (user_id),
    INDEX idx_read (is_read),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='알림';

-- ============================================================================
-- 10. 고객지원 테이블
-- ============================================================================

-- 지원 티켓
CREATE TABLE support_tickets (
    ticket_id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL COMMENT '요청자',

    -- 티켓 정보
    category ENUM('기술', '결제', '계정', '기타') NOT NULL,
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',

    -- 상태
    status ENUM('open', 'in_progress', 'waiting_customer', 'resolved', 'closed') DEFAULT 'open',
    assigned_to VARCHAR(36) COMMENT '담당자 user_id',

    -- 해결
    resolution TEXT COMMENT '해결 내용',
    resolved_at TIMESTAMP NULL,
    satisfaction_rating INT COMMENT '만족도 (1-5)',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (assigned_to) REFERENCES users(user_id),
    INDEX idx_user (user_id),
    INDEX idx_status (status),
    INDEX idx_assigned (assigned_to)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='고객지원 티켓';

-- 티켓 코멘트
CREATE TABLE ticket_comments (
    comment_id VARCHAR(36) PRIMARY KEY,
    ticket_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,

    content TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT FALSE COMMENT '내부 메모 여부',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (ticket_id) REFERENCES support_tickets(ticket_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='티켓 코멘트';

-- ============================================================================
-- 11. 교재/단원 테이블
-- ============================================================================

-- 교재
CREATE TABLE textbooks (
    textbook_id VARCHAR(20) PRIMARY KEY,
    curi_year_id INT NOT NULL COMMENT '교육과정 연도',
    subject_minor_id VARCHAR(10) NOT NULL COMMENT '과목',
    publisher_id INT COMMENT '출판사',
    author_id INT COMMENT '저자',
    title VARCHAR(255) NOT NULL COMMENT '교재명',
    year INT NOT NULL COMMENT '출판연도',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (curi_year_id) REFERENCES curriculum_years(curi_year_id),
    FOREIGN KEY (subject_minor_id) REFERENCES subject_codes_minor(subject_minor_id),
    FOREIGN KEY (publisher_id) REFERENCES publishers(publisher_id),
    FOREIGN KEY (author_id) REFERENCES publisher_authors(author_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='교재';

-- 교재 단원
CREATE TABLE textbook_units (
    unit_id INT AUTO_INCREMENT PRIMARY KEY,
    textbook_id VARCHAR(20) NOT NULL,

    unit_level ENUM('large', 'medium', 'small') NOT NULL COMMENT '단원 레벨',
    parent_unit_id INT COMMENT '상위 단원 ID',
    unit_name VARCHAR(255) NOT NULL,
    unit_order INT NOT NULL COMMENT '순서',

    FOREIGN KEY (textbook_id) REFERENCES textbooks(textbook_id),
    FOREIGN KEY (parent_unit_id) REFERENCES textbook_units(unit_id),
    INDEX idx_textbook (textbook_id),
    INDEX idx_parent (parent_unit_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='교재 단원';

-- ============================================================================
-- 초기 데이터 삽입
-- ============================================================================

-- 학년 코드
INSERT INTO school_grades (grade_id, grade_name, school_level, sort_order) VALUES
('HN', 'N수', 'N수', 0),
('H3', '고3', '고등', 1),
('H2', '고2', '고등', 2),
('H1', '고1', '고등', 3),
('M3', '중3', '중등', 4),
('M2', '중2', '중등', 5),
('M1', '중1', '중등', 6),
('P6', '초6', '초등', 7),
('P5', '초5', '초등', 8),
('P4', '초4', '초등', 9),
('P3', '초3', '초등', 10),
('P2', '초2', '초등', 11),
('P1', '초1', '초등', 12);

-- 교육과정 연도
INSERT INTO curriculum_years (curi_year_id, curi_year_name) VALUES
(15, '2015개정교육'),
(22, '2022개정교육');

-- 시험 유형
INSERT INTO test_types (test_type_id, test_type_name) VALUES
('NS', '내신'),
('SN', '수능'),
('ME', '모의'),
('NO', '논술'),
('SM', '심층면접'),
('TJ', '특목자사');

-- 주요 과목 코드
INSERT INTO subject_codes_major (subject_major_id, subject_area, subject_code, sort_order) VALUES
('K1', '국어', 'K', 1),
('M1', '수학', 'M', 2),
('E1', '영어', 'E', 3),
('S1', '사회', 'S', 4),
('C1', '과학', 'C', 5),
('H1', '한국사', 'H', 6);

-- 기본 역할
INSERT INTO roles (role_id, role_name, role_scope, description) VALUES
('R_STUDENT', '학생', '개인', '학습자 역할'),
('R_PARENT', '학부모', '개인', '학부모 역할'),
('R_TUTOR', '학습관리선생님', '기관', '학습 관리 및 지도'),
('R_EDITOR', '에디터', '기관', '문제 편집 및 검수'),
('R_CHIEF_EDITOR', '수석에디터', '기관', '에디터 관리 및 최종 검수'),
('R_ADMIN', '관리자', '시스템', '시스템 관리자'),
('R_SALES', '영업', '기관', '영업 담당'),
('R_AGENCY', '대행사', '기관', '대행사 역할'),
('R_ACADEMY', '학원', '기관', '학원 관리자'),
('R_CS', '고객서비스', '시스템', '고객 지원');

-- 기본 권한
INSERT INTO permissions (perm_id, perm_name, category) VALUES
('problems:read', '문제 조회', '문제'),
('problems:create', '문제 생성', '문제'),
('problems:update', '문제 수정', '문제'),
('problems:delete', '문제 삭제', '문제'),
('problems:review', '문제 검수', '문제'),
('papers:read', '시험지 조회', '시험지'),
('papers:create', '시험지 생성', '시험지'),
('papers:update', '시험지 수정', '시험지'),
('papers:delete', '시험지 삭제', '시험지'),
('users:read', '사용자 조회', '사용자'),
('users:create', '사용자 생성', '사용자'),
('users:update', '사용자 수정', '사용자'),
('users:delete', '사용자 삭제', '사용자'),
('admin:access', '관리자 접근', '관리');

-- ============================================================================
-- 뷰 생성
-- ============================================================================

-- 학생 상세 정보 뷰
CREATE OR REPLACE VIEW v_student_details AS
SELECT
    u.user_id,
    u.email,
    u.name,
    u.phone,
    u.school_name,
    h.school_name as school_official_name,
    sg.grade_name,
    u.enrollment_year,
    u.verification_status,
    u.is_active,
    u.created_at,
    u.last_login
FROM users u
LEFT JOIN highschools h ON u.school_id = h.school_id
LEFT JOIN school_grades sg ON u.grade_id = sg.grade_id
WHERE u.user_type = 'ST';

-- 문제 통계 뷰
CREATE OR REPLACE VIEW v_problem_stats AS
SELECT
    sm.subject_area,
    smi.subject_name,
    tt.test_type_name,
    pr.difficulty,
    COUNT(*) as problem_count,
    AVG(CASE WHEN pr.status = '승인' THEN 1 ELSE 0 END) as approval_rate
FROM problems_reference pr
JOIN subject_codes_major sm ON pr.subject_major_id = sm.subject_major_id
LEFT JOIN subject_codes_minor smi ON pr.subject_minor_id = smi.subject_minor_id
JOIN test_types tt ON pr.test_type_id = tt.test_type_id
GROUP BY sm.subject_area, smi.subject_name, tt.test_type_name, pr.difficulty;

-- ============================================================================
-- 완료
-- ============================================================================
