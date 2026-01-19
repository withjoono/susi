import { Entity, Column, PrimaryColumn, Index, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * 수시 모집단위 계열 분류 테이블
 * - ID는 수시 모집단위 ID와 동일 (26-U001211)
 * - 대계열, 중계열, 소계열 정보
 */
@Entity('ss_unit_categories', { comment: '수시 모집단위 계열 분류' })
@Index('idx_ss_uc_major_field', ['majorFieldCode'])
@Index('idx_ss_uc_mid_field', ['midFieldCode'])
@Index('idx_ss_uc_minor_field', ['minorFieldCode'])
export class SusiUnitCategoryEntity {
  /**
   * 모집단위 ID (예: 26-U001211)
   */
  @PrimaryColumn({ type: 'varchar', length: 20, comment: '모집단위 ID (예: 26-U001211)' })
  id: string;

  /**
   * 계열코드 (예: 832)
   */
  @Column({ name: 'field_code', type: 'varchar', length: 10, comment: '계열코드 (예: 832)' })
  fieldCode: string;

  // ========== 대계열 정보 ==========

  @Column({ name: 'major_field', type: 'varchar', length: 50, comment: '대계열 (예: 자연계열)' })
  majorField: string;

  @Column({ name: 'major_field_code', type: 'int', comment: '대계열코드' })
  majorFieldCode: number;

  // ========== 중계열 정보 ==========

  @Column({ name: 'mid_field', type: 'varchar', length: 50, comment: '중계열 (예: 생활과학)' })
  midField: string;

  @Column({ name: 'mid_field_code', type: 'int', comment: '중계열코드' })
  midFieldCode: number;

  // ========== 소계열 정보 ==========

  @Column({ name: 'minor_field', type: 'varchar', length: 100, comment: '소계열 (예: 교양생활과학)' })
  minorField: string;

  @Column({ name: 'minor_field_code', type: 'int', comment: '소계열코드' })
  minorFieldCode: number;

  // ========== 타임스탬프 ==========

  @CreateDateColumn({ name: 'created_at', comment: '생성일시' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', comment: '수정일시' })
  updatedAt: Date;
}
