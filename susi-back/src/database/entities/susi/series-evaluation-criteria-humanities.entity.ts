import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * 문과 계열 적합성 평가 기준
 * 대학 레벨별 주요 교과 권장 등급
 */
@Entity({ name: 'series_evaluation_criteria_humanities' })
export class SeriesEvaluationCriteriaHumanitiesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', comment: '대학 레벨 (1-7)' })
  level: number;

  @Column({ name: 'university_category', type: 'varchar', length: 100, comment: '대학 범례' })
  universityCategory: string;

  @Column({ type: 'decimal', precision: 3, scale: 1, comment: '국어 권장 등급' })
  korean: number;

  @Column({ type: 'decimal', precision: 3, scale: 1, comment: '영어 권장 등급' })
  english: number;

  @Column({ type: 'decimal', precision: 3, scale: 1, comment: '수학 권장 등급' })
  math: number;

  @Column({ type: 'decimal', precision: 3, scale: 1, comment: '사회 권장 등급' })
  social: number;

  @Column({
    name: 'second_foreign_language',
    type: 'decimal',
    precision: 3,
    scale: 1,
    comment: '제2외국어 권장 등급',
  })
  secondForeignLanguage: number;

  @Column({
    name: 'overall_grade_range',
    type: 'varchar',
    length: 20,
    nullable: true,
    comment: '전체 등급 범위',
  })
  overallGradeRange: string;
}
