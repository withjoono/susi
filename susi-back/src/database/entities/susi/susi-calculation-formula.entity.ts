import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

/**
 * 수시 교과전형 대학별 환산 공식 테이블
 * - 대학별 학년/교과별 반영비율
 * - 등급별 환산점수 테이블 (JSONB)
 * - 엑셀에서 파싱하여 저장
 */
@Entity('susi_calculation_formula', { comment: '수시 교과전형 환산 공식' })
@Index(['university_name'])
@Index(['year'])
@Index(['university_name', 'year'], { unique: true })
export class SusiCalculationFormulaEntity {
  @PrimaryGeneratedColumn({ comment: '고유 ID' })
  id: number;

  @Column({ type: 'int', comment: '적용 연도', default: 2026 })
  year: number;

  @Column({ type: 'varchar', length: 100, comment: '대학명' })
  university_name: string;

  @Column({ type: 'varchar', length: 20, nullable: true, comment: '대학 코드' })
  university_code: string;

  // ========== 반영 학기 ==========
  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: '반영 학기 (예: 1-1,1-2,2-1,2-2,3-1)',
  })
  reflection_semesters: string;

  // ========== 학년별 반영비율 ==========
  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0,
    comment: '1학년 반영비율 (%)',
  })
  grade_1_ratio: number;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0,
    comment: '2학년 반영비율 (%)',
  })
  grade_2_ratio: number;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0,
    comment: '3학년 반영비율 (%)',
  })
  grade_3_ratio: number;

  // ========== 교과별 반영비율 ==========
  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0,
    comment: '국어 반영비율 (%)',
  })
  korean_ratio: number;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0,
    comment: '영어 반영비율 (%)',
  })
  english_ratio: number;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0,
    comment: '수학 반영비율 (%)',
  })
  math_ratio: number;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0,
    comment: '사회 반영비율 (%)',
  })
  social_ratio: number;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0,
    comment: '과학 반영비율 (%)',
  })
  science_ratio: number;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0,
    comment: '기타 교과 반영비율 (%)',
  })
  etc_ratio: number;

  // ========== 반영 과목 수 ==========
  @Column({
    type: 'int',
    nullable: true,
    comment: '반영 과목 수 (전체)',
  })
  reflection_subject_count: number;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
    comment: '반영 교과 상세 설명',
  })
  reflection_subject_detail: string;

  // ========== 등급별 환산점수 테이블 (JSONB) ==========
  @Column({
    type: 'jsonb',
    nullable: true,
    comment: '등급별 환산점수 테이블 { "1": 100, "2": 98, ... "9": 0 }',
  })
  grade_conversion_table: Record<string, number>;

  // ========== 진로선택과목 환산 방식 ==========
  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: '진로선택과목 환산 방식 (예: A=1등급, B=3등급, C=5등급)',
  })
  career_subject_conversion: string;

  @Column({
    type: 'jsonb',
    nullable: true,
    comment: '진로선택과목 성취도별 환산점수 { "A": 100, "B": 95, "C": 90 }',
  })
  career_grade_conversion_table: Record<string, number>;

  // ========== 출결 반영 ==========
  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0,
    comment: '출결 반영 점수',
  })
  attendance_score: number;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
    comment: '출결 감점 기준',
  })
  attendance_deduction_rule: string;

  // ========== 봉사활동 반영 ==========
  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0,
    comment: '봉사활동 반영 점수',
  })
  volunteer_score: number;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
    comment: '봉사활동 기준',
  })
  volunteer_rule: string;

  // ========== 환산점수 총점 ==========
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 1000,
    comment: '환산점수 만점',
  })
  max_score: number;

  // ========== 메타 정보 ==========
  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
    comment: '특이사항 및 비고',
  })
  remarks: string;

  @Column({ type: 'boolean', default: true, comment: '활성화 여부' })
  is_active: boolean;

  @CreateDateColumn({ comment: '생성일시' })
  created_at: Date;

  @UpdateDateColumn({ comment: '수정일시' })
  updated_at: Date;
}
