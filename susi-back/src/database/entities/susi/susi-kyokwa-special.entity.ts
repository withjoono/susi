import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * 교과전형 일반/특별전형 구분 엔티티
 * 테이블: susi_kyokwa_special
 * 일반전형/특별전형 구분 및 지원자격
 */
@Entity('susi_kyokwa_special')
@Index('idx_susi_kyokwa_special_ida_id', ['idaId'], { unique: true })
@Index('idx_susi_kyokwa_special_category', ['admissionCategory'])
export class SusiKyokwaSpecialEntity {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * IDA 고유 ID (예: 26-U001211)
   */
  @Column({ name: 'ida_id', type: 'varchar', length: 50, unique: true })
  idaId: string;

  /**
   * 전형 구분 (일반/특별)
   */
  @Column({ name: 'admission_category', type: 'varchar', length: 20, nullable: true })
  admissionCategory: string;

  /**
   * 2026년 지원자격
   */
  @Column({ name: 'qualification_2026', type: 'text', nullable: true })
  qualification2026: string;

  // ========== 타임스탬프 ==========

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
