import { Entity, PrimaryColumn, Column, Index } from 'typeorm';

/**
 * 계열별 필수과목/권장과목 엔티티
 * 각 소계열(Minor Field)에 대한 과목별 필수/권장 여부를 저장
 */
@Entity('ss_category_subject_necessity')
@Index(['categoryId', 'subjectName'])
@Index(['majorFieldCode', 'subjectName'])
@Index(['midFieldCode', 'subjectName'])
@Index(['minorFieldCode', 'subjectName'])
export class SusiCategorySubjectNecessityEntity {
  /**
   * Primary Key: categoryId + subjectName 조합
   * 예: "111_수학_확률과통계", "111_물리학1"
   */
  @PrimaryColumn({ type: 'varchar', length: 100 })
  id: string;

  /**
   * 계열 ID (ss_unit_categories의 id와 연결)
   * 예: "111"
   */
  @Column({ type: 'varchar', length: 20, name: 'category_id' })
  @Index()
  categoryId: string;

  /**
   * 대계열 (예: "공학계열")
   */
  @Column({ type: 'varchar', length: 50, name: 'major_field' })
  majorField: string;

  /**
   * 대계열 코드 (예: 1)
   */
  @Column({ type: 'integer', name: 'major_field_code' })
  majorFieldCode: number;

  /**
   * 중계열 (예: "건축")
   */
  @Column({ type: 'varchar', length: 50, name: 'mid_field' })
  midField: string;

  /**
   * 중계열 코드 (예: 1)
   */
  @Column({ type: 'integer', name: 'mid_field_code' })
  midFieldCode: number;

  /**
   * 소계열 (예: "건축학")
   */
  @Column({ type: 'varchar', length: 100, name: 'minor_field' })
  minorField: string;

  /**
   * 소계열 코드 (예: 1)
   */
  @Column({ type: 'integer', name: 'minor_field_code' })
  minorFieldCode: number;

  /**
   * 과목명
   * 예: "수학_확률과통계", "수학_미적", "물리학1", "국어", "수학" 등
   */
  @Column({ type: 'varchar', length: 50, name: 'subject_name' })
  subjectName: string;

  /**
   * 필수/권장 수준
   * 1: 핵심(필수)
   * 2: 권장
   */
  @Column({ type: 'integer', name: 'necessity_level' })
  necessityLevel: number;

  /**
   * 과목 유형
   * 'inquiry': 탐구과목 (수학, 과학 계열)
   * 'major': 주요교과 (국어, 수학, 영어, 사회, 과학, 한국사, 제2외)
   */
  @Column({ type: 'varchar', length: 20, name: 'subject_type' })
  subjectType: 'inquiry' | 'major';

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
