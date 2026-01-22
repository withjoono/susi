import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * 종합전형 입시결과 엔티티
 * 테이블: susi_jonghap_ipkyul
 * 연도별 입시 결과 데이터 (등급컷, 경쟁률 등)
 */
@Entity('susi_jonghap_ipkyul')
@Index('idx_susi_jonghap_ipkyul_ida_id', ['idaId'], { unique: true })
@Index('idx_susi_jonghap_ipkyul_university_code', ['universityCode'])
@Index('idx_susi_jonghap_ipkyul_admission_type', ['admissionType'])
export class SusiJonghapIpkyulEntity {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * IDA 고유 ID (예: 26-U001211)
   */
  @Column({ name: 'ida_id', type: 'varchar', length: 50, unique: true })
  idaId: string;

  // ========== 대학/전형 정보 ==========

  @Column({ name: 'university_name', type: 'varchar', length: 200, nullable: true })
  universityName: string;

  @Column({ name: 'university_code', type: 'varchar', length: 20, nullable: true })
  universityCode: string;

  @Column({ name: 'admission_type', type: 'varchar', length: 50, nullable: true })
  admissionType: string;

  @Column({ name: 'admission_type_code', type: 'int', nullable: true })
  admissionTypeCode: number;

  @Column({ name: 'admission_detail', type: 'varchar', length: 200, nullable: true })
  admissionDetail: string;

  @Column({ name: 'category', type: 'varchar', length: 100, nullable: true })
  category: string;

  @Column({ name: 'recruitment_unit', type: 'varchar', length: 200, nullable: true })
  recruitmentUnit: string;

  // ========== 평균 등급 ==========

  @Column({ name: 'grade_avg', type: 'decimal', precision: 10, scale: 2, nullable: true })
  gradeAvg: number;

  @Column({ name: 'grade_70p_cut', type: 'decimal', precision: 10, scale: 2, nullable: true })
  grade70pCut: number;

  @Column({ name: 'grade_90p_cut', type: 'decimal', precision: 10, scale: 2, nullable: true })
  grade90pCut: number;

  // ========== 2023년도 데이터 ==========

  @Column({ name: 'recruitment_2023', type: 'int', nullable: true })
  recruitment2023: number;

  @Column({ name: 'competition_rate_2023', type: 'decimal', precision: 10, scale: 2, nullable: true })
  competitionRate2023: number;

  @Column({ name: 'additional_pass_rank_2023', type: 'int', nullable: true })
  additionalPassRank2023: number;

  @Column({ name: 'actual_competition_rate_2023', type: 'decimal', precision: 10, scale: 2, nullable: true })
  actualCompetitionRate2023: number;

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
