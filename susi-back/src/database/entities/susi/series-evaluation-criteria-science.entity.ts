import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * 이과 계열 적합성 평가 기준
 * 대학 레벨별 필수/장려 과목 권장 등급
 */
@Entity({ name: 'series_evaluation_criteria_science' })
export class SeriesEvaluationCriteriaScienceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', comment: '대학 레벨 (1-7)' })
  level: number;

  @Column({ name: 'university_category', type: 'varchar', length: 100, comment: '대학 범례' })
  universityCategory: string;

  @Column({
    type: 'decimal',
    precision: 3,
    scale: 1,
    comment: '확률과 통계 권장 등급',
  })
  statistics: number;

  @Column({ type: 'decimal', precision: 3, scale: 1, comment: '미적분 권장 등급' })
  calculus: number;

  @Column({ type: 'decimal', precision: 3, scale: 1, comment: '기하 권장 등급' })
  geometry: number;

  @Column({
    name: 'ai_math',
    type: 'decimal',
    precision: 3,
    scale: 1,
    comment: '인공지능 수학 권장 등급',
  })
  aiMath: number;

  @Column({ type: 'decimal', precision: 3, scale: 1, comment: '물리Ⅰ 권장 등급' })
  physics1: number;

  @Column({ type: 'decimal', precision: 3, scale: 1, comment: '물리Ⅱ 권장 등급' })
  physics2: number;

  @Column({ type: 'decimal', precision: 3, scale: 1, comment: '화학Ⅰ 권장 등급' })
  chemistry1: number;

  @Column({ type: 'decimal', precision: 3, scale: 1, comment: '화학Ⅱ 권장 등급' })
  chemistry2: number;

  @Column({
    type: 'decimal',
    precision: 3,
    scale: 1,
    comment: '생명과학Ⅰ 권장 등급',
  })
  biology1: number;

  @Column({
    type: 'decimal',
    precision: 3,
    scale: 1,
    comment: '생명과학Ⅱ 권장 등급',
  })
  biology2: number;

  @Column({
    name: 'earth_science1',
    type: 'decimal',
    precision: 3,
    scale: 1,
    comment: '지구과학Ⅰ 권장 등급',
  })
  earthScience1: number;

  @Column({
    name: 'earth_science2',
    type: 'decimal',
    precision: 3,
    scale: 1,
    comment: '지구과학Ⅱ 권장 등급',
  })
  earthScience2: number;
}
