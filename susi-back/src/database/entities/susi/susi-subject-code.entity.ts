import { Entity, PrimaryColumn, Column, Index } from 'typeorm';

/**
 * 2015 개정 교육과정 교과/과목 코드 엔티티
 * 교과(주요교과)와 과목의 코드 및 정보를 저장
 */
@Entity('ss_subject_codes')
@Index(['mainSubjectCode', 'subjectCode'])
export class SusiSubjectCodeEntity {
  /**
   * 고유 ID (예: HH0111, HH0122)
   */
  @PrimaryColumn({ type: 'varchar', length: 20 })
  id: string;

  /**
   * 주요 교과명 (예: 국어, 수학, 영어, 사회, 과학)
   */
  @Column({ type: 'varchar', length: 50, name: 'main_subject_name' })
  mainSubjectName: string;

  /**
   * 주요 교과 코드 (예: HH01, HH02)
   */
  @Column({ type: 'varchar', length: 20, name: 'main_subject_code' })
  @Index()
  mainSubjectCode: string;

  /**
   * 과목 종류 (공통과목, 일반선택, 진로선택, 전문교과Ⅰ, 전문교과Ⅱ)
   */
  @Column({ type: 'varchar', length: 50, name: 'course_type_name' })
  courseTypeName: string;

  /**
   * 과목 종류 코드
   * 1: 공통과목
   * 2: 일반선택
   * 3: 진로선택
   * 4: 전문교과Ⅰ
   * 5: 전문교과Ⅱ
   */
  @Column({ type: 'integer', name: 'course_type_code' })
  @Index()
  courseTypeCode: number;

  /**
   * 과목명 (예: 독서, 문학, 미적분, 물리학Ⅰ)
   */
  @Column({ type: 'varchar', length: 100, name: 'subject_name' })
  subjectName: string;

  /**
   * 과목 코드 (각 교과 내에서의 순번)
   */
  @Column({ type: 'integer', name: 'subject_code' })
  subjectCode: number;

  /**
   * 평가 방식 (석차등급, 성취도)
   */
  @Column({ type: 'varchar', length: 20, name: 'evaluation_type' })
  evaluationType: string;

  @Column({
    type: 'timestamp',
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
