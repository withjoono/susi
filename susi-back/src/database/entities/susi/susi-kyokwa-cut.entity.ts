import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * 교과전형 입시결과 엔티티
 * 테이블: susi_kyokwa_cut
 * 연도별 입시 결과 데이터 (등급컷, 경쟁률, 환산점수 등)
 */
@Entity('susi_kyokwa_cut')
@Index('idx_susi_kyokwa_cut_ida_id', ['idaId'], { unique: true })
export class SusiKyokwaCutEntity {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * IDA 고유 ID (예: 26-U001211)
   */
  @Column({ name: 'ida_id', type: 'varchar', length: 50, unique: true })
  idaId: string;

  // ========== 평균 등급/환산점수 ==========

  @Column({ name: 'grade_avg', type: 'decimal', precision: 10, scale: 2, nullable: true })
  gradeAvg: number;

  @Column({ name: 'grade_initial_cut', type: 'decimal', precision: 10, scale: 2, nullable: true })
  gradeInitialCut: number;

  @Column({ name: 'grade_additional_cut', type: 'decimal', precision: 10, scale: 2, nullable: true })
  gradeAdditionalCut: number;

  @Column({ name: 'converted_score_initial_cut', type: 'decimal', precision: 10, scale: 2, nullable: true })
  convertedScoreInitialCut: number;

  @Column({ name: 'converted_score_avg', type: 'decimal', precision: 10, scale: 2, nullable: true })
  convertedScoreAvg: number;

  @Column({ name: 'converted_score_additional_cut', type: 'decimal', precision: 10, scale: 2, nullable: true })
  convertedScoreAdditionalCut: number;

  @Column({ name: 'converted_total_score', type: 'decimal', precision: 10, scale: 2, nullable: true })
  convertedTotalScore: number;

  // ========== 2023년도 데이터 ==========

  @Column({ name: 'recruitment_2023', type: 'int', nullable: true })
  recruitment2023: number;

  @Column({ name: 'competition_rate_2023', type: 'decimal', precision: 10, scale: 2, nullable: true })
  competitionRate2023: number;

  @Column({ name: 'additional_pass_rank_2023', type: 'int', nullable: true })
  additionalPassRank2023: number;

  @Column({ name: 'actual_competition_rate_2023', type: 'decimal', precision: 10, scale: 2, nullable: true })
  actualCompetitionRate2023: number;

  @Column({ name: 'converted_score_50p_2023', type: 'decimal', precision: 10, scale: 2, nullable: true })
  convertedScore50p2023: number;

  @Column({ name: 'converted_score_70p_2023', type: 'decimal', precision: 10, scale: 2, nullable: true })
  convertedScore70p2023: number;

  @Column({ name: 'total_score_2023', type: 'decimal', precision: 10, scale: 2, nullable: true })
  totalScore2023: number;

  @Column({ name: 'grade_50p_2023', type: 'decimal', precision: 10, scale: 2, nullable: true })
  grade50p2023: number;

  @Column({ name: 'grade_70p_2023', type: 'decimal', precision: 10, scale: 2, nullable: true })
  grade70p2023: number;

  // ========== 2024년도 데이터 ==========

  @Column({ name: 'recruitment_2024', type: 'int', nullable: true })
  recruitment2024: number;

  @Column({ name: 'competition_rate_2024', type: 'decimal', precision: 10, scale: 2, nullable: true })
  competitionRate2024: number;

  @Column({ name: 'additional_pass_rank_2024', type: 'int', nullable: true })
  additionalPassRank2024: number;

  @Column({ name: 'actual_competition_rate_2024', type: 'decimal', precision: 10, scale: 2, nullable: true })
  actualCompetitionRate2024: number;

  @Column({ name: 'converted_score_50p_2024', type: 'decimal', precision: 10, scale: 2, nullable: true })
  convertedScore50p2024: number;

  @Column({ name: 'converted_score_70p_2024', type: 'decimal', precision: 10, scale: 2, nullable: true })
  convertedScore70p2024: number;

  @Column({ name: 'total_score_2024', type: 'decimal', precision: 10, scale: 2, nullable: true })
  totalScore2024: number;

  @Column({ name: 'grade_50p_2024', type: 'decimal', precision: 10, scale: 2, nullable: true })
  grade50p2024: number;

  @Column({ name: 'grade_70p_2024', type: 'decimal', precision: 10, scale: 2, nullable: true })
  grade70p2024: number;

  // ========== 2025년도 데이터 ==========

  @Column({ name: 'recruitment_2025', type: 'int', nullable: true })
  recruitment2025: number;

  @Column({ name: 'competition_rate_2025', type: 'decimal', precision: 10, scale: 2, nullable: true })
  competitionRate2025: number;

  @Column({ name: 'additional_pass_rank_2025', type: 'int', nullable: true })
  additionalPassRank2025: number;

  @Column({ name: 'actual_competition_rate_2025', type: 'decimal', precision: 10, scale: 2, nullable: true })
  actualCompetitionRate2025: number;

  @Column({ name: 'converted_score_50p_2025', type: 'decimal', precision: 10, scale: 2, nullable: true })
  convertedScore50p2025: number;

  @Column({ name: 'converted_score_70p_2025', type: 'decimal', precision: 10, scale: 2, nullable: true })
  convertedScore70p2025: number;

  @Column({ name: 'total_score_2025', type: 'decimal', precision: 10, scale: 2, nullable: true })
  totalScore2025: number;

  @Column({ name: 'grade_50p_2025', type: 'decimal', precision: 10, scale: 2, nullable: true })
  grade50p2025: number;

  @Column({ name: 'grade_70p_2025', type: 'decimal', precision: 10, scale: 2, nullable: true })
  grade70p2025: number;

  // ========== 2026년도 데이터 ==========

  @Column({ name: 'recruitment_2026', type: 'int', nullable: true })
  recruitment2026: number;

  @Column({ name: 'competition_rate_2026', type: 'decimal', precision: 10, scale: 2, nullable: true })
  competitionRate2026: number;

  @Column({ name: 'additional_pass_rank_2026', type: 'int', nullable: true })
  additionalPassRank2026: number;

  @Column({ name: 'actual_competition_rate_2026', type: 'decimal', precision: 10, scale: 2, nullable: true })
  actualCompetitionRate2026: number;

  @Column({ name: 'converted_score_50p_2026', type: 'decimal', precision: 10, scale: 2, nullable: true })
  convertedScore50p2026: number;

  @Column({ name: 'converted_score_70p_2026', type: 'decimal', precision: 10, scale: 2, nullable: true })
  convertedScore70p2026: number;

  @Column({ name: 'total_score_2026', type: 'decimal', precision: 10, scale: 2, nullable: true })
  totalScore2026: number;

  @Column({ name: 'grade_50p_2026', type: 'decimal', precision: 10, scale: 2, nullable: true })
  grade50p2026: number;

  @Column({ name: 'grade_70p_2026', type: 'decimal', precision: 10, scale: 2, nullable: true })
  grade70p2026: number;

  // ========== 타임스탬프 ==========

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
