import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * 교과전형 입결(입시결과) 엔티티
 * 테이블: susi_kyokwa_ipkyul
 * 연도별 입시 결과 데이터 (학생부 등급컷, 경쟁률 등)
 */
@Entity('susi_kyokwa_ipkyul')
@Index('idx_susi_kyokwa_ipkyul_ida_id', ['idaId'], { unique: true })
export class SusiKyokwaIpkyulEntity {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * IDA 고유 ID (예: 26-U0081A1)
   */
  @Column({ name: 'ida_id', type: 'varchar', length: 50, unique: true })
  idaId: string;

  // ========== 2023년도 데이터 ==========

  @Column({ name: 'recruitment_2023', type: 'int', nullable: true })
  recruitment2023: number;

  @Column({ name: 'competition_rate_2023', type: 'decimal', precision: 10, scale: 2, nullable: true })
  competitionRate2023: number;

  @Column({ name: 'additional_pass_rank_2023', type: 'int', nullable: true })
  additionalPassRank2023: number;

  @Column({ name: 'actual_competition_rate_2023', type: 'decimal', precision: 10, scale: 2, nullable: true })
  actualCompetitionRate2023: number;

  @Column({ name: 'student_record_grade_50_2023', type: 'decimal', precision: 10, scale: 2, nullable: true })
  studentRecordGrade50_2023: number;

  @Column({ name: 'student_record_grade_70_2023', type: 'decimal', precision: 10, scale: 2, nullable: true })
  studentRecordGrade70_2023: number;

  // ========== 2024년도 데이터 ==========

  @Column({ name: 'recruitment_2024', type: 'int', nullable: true })
  recruitment2024: number;

  @Column({ name: 'competition_rate_2024', type: 'decimal', precision: 10, scale: 2, nullable: true })
  competitionRate2024: number;

  @Column({ name: 'additional_pass_rank_2024', type: 'int', nullable: true })
  additionalPassRank2024: number;

  @Column({ name: 'actual_competition_rate_2024', type: 'decimal', precision: 10, scale: 2, nullable: true })
  actualCompetitionRate2024: number;

  @Column({ name: 'student_record_grade_50_2024', type: 'decimal', precision: 10, scale: 2, nullable: true })
  studentRecordGrade50_2024: number;

  @Column({ name: 'student_record_grade_70_2024', type: 'decimal', precision: 10, scale: 2, nullable: true })
  studentRecordGrade70_2024: number;

  // ========== 2025년도 데이터 ==========

  @Column({ name: 'recruitment_2025', type: 'int', nullable: true })
  recruitment2025: number;

  @Column({ name: 'competition_rate_2025', type: 'decimal', precision: 10, scale: 2, nullable: true })
  competitionRate2025: number;

  @Column({ name: 'additional_pass_rank_2025', type: 'int', nullable: true })
  additionalPassRank2025: number;

  @Column({ name: 'actual_competition_rate_2025', type: 'decimal', precision: 10, scale: 2, nullable: true })
  actualCompetitionRate2025: number;

  @Column({ name: 'student_record_grade_50_2025', type: 'decimal', precision: 10, scale: 2, nullable: true })
  studentRecordGrade50_2025: number;

  @Column({ name: 'student_record_grade_70_2025', type: 'decimal', precision: 10, scale: 2, nullable: true })
  studentRecordGrade70_2025: number;

  // ========== 2026년도 데이터 ==========

  @Column({ name: 'recruitment_2026', type: 'int', nullable: true })
  recruitment2026: number;

  @Column({ name: 'competition_rate_2026', type: 'decimal', precision: 10, scale: 2, nullable: true })
  competitionRate2026: number;

  @Column({ name: 'additional_pass_rank_2026', type: 'int', nullable: true })
  additionalPassRank2026: number;

  @Column({ name: 'actual_competition_rate_2026', type: 'decimal', precision: 10, scale: 2, nullable: true })
  actualCompetitionRate2026: number;

  @Column({ name: 'student_record_grade_50_2026', type: 'decimal', precision: 10, scale: 2, nullable: true })
  studentRecordGrade50_2026: number;

  @Column({ name: 'student_record_grade_70_2026', type: 'decimal', precision: 10, scale: 2, nullable: true })
  studentRecordGrade70_2026: number;

  // ========== 타임스탬프 ==========

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
