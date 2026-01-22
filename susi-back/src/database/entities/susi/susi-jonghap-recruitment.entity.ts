import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * 종합전형 세부내역 엔티티
 * 테이블: susi_jonghap_recruitment
 * 전형 방법, 지원자격, 지역 정보 등
 */
@Entity('susi_jonghap_recruitment')
@Index('idx_susi_jonghap_recruitment_ida_id', ['idaId'], { unique: true })
@Index('idx_susi_jonghap_recruitment_university_code', ['universityCode'])
@Index('idx_susi_jonghap_recruitment_admission_type', ['admissionType'])
@Index('idx_susi_jonghap_recruitment_category', ['category'])
export class SusiJonghapRecruitmentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * IDA 고유 ID (예: 26-U001211)
   */
  @Column({ name: 'ida_id', type: 'varchar', length: 50, unique: true })
  idaId: string;

  // ========== 대학 정보 ==========

  @Column({ name: 'university_name', type: 'varchar', length: 200, nullable: true })
  universityName: string;

  @Column({ name: 'university_code', type: 'varchar', length: 20, nullable: true })
  universityCode: string;

  @Column({ name: 'university_type', type: 'varchar', length: 50, nullable: true })
  universityType: string;

  // ========== 전형 정보 ==========

  @Column({ name: 'admission_type', type: 'varchar', length: 50, nullable: true })
  admissionType: string;

  @Column({ name: 'admission_name', type: 'varchar', length: 200, nullable: true })
  admissionName: string;

  @Column({ name: 'category', type: 'varchar', length: 100, nullable: true })
  category: string;

  @Column({ name: 'recruitment_unit', type: 'varchar', length: 200, nullable: true })
  recruitmentUnit: string;

  // ========== 지역 정보 ==========

  @Column({ name: 'region_major', type: 'varchar', length: 100, nullable: true })
  regionMajor: string;

  @Column({ name: 'region_detail', type: 'varchar', length: 100, nullable: true })
  regionDetail: string;

  // ========== 전형 구분 ==========

  @Column({ name: 'admission_category', type: 'varchar', length: 20, nullable: true })
  admissionCategory: string;

  @Column({ name: 'special_admission_types', type: 'varchar', length: 200, nullable: true })
  specialAdmissionTypes: string;

  @Column({ name: 'qualification', type: 'text', nullable: true })
  qualification: string;

  // ========== 전형 방법 ==========

  @Column({ name: 'admission_method', type: 'text', nullable: true })
  admissionMethod: string;

  @Column({ name: 'minimum_standard', type: 'text', nullable: true })
  minimumStandard: string;

  @Column({ name: 'recruitment_count', type: 'int', nullable: true })
  recruitmentCount: number;

  // ========== 계열 분류 ==========

  @Column({ name: 'major_field', type: 'varchar', length: 100, nullable: true })
  majorField: string;

  @Column({ name: 'mid_field', type: 'varchar', length: 100, nullable: true })
  midField: string;

  @Column({ name: 'minor_field', type: 'varchar', length: 200, nullable: true })
  minorField: string;

  // ========== 타임스탬프 ==========

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
