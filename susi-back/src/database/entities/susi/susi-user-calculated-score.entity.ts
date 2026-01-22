import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { MemberEntity } from '../member/member.entity';

/**
 * 수시 교과전형 대학별 환산점수 저장 테이블
 * - 사용자별, 대학별 환산점수 저장
 * - 교과별 상세 점수 포함
 */
@Entity('susi_user_calculated_scores', { comment: '수시 교과전형 대학별 환산점수' })
@Index(['member_id', 'university_name'], { unique: true })
@Index(['member_id'])
@Index(['university_name'])
export class SusiUserCalculatedScoreEntity {
  @PrimaryGeneratedColumn({ comment: '고유 ID' })
  id: number;

  @Column({ type: 'int', comment: '회원 ID' })
  member_id: number;

  @Column({ type: 'varchar', length: 100, comment: '대학명' })
  university_name: string;

  @Column({ type: 'int', nullable: true, comment: '적용 연도' })
  year: number;

  // ========== 환산점수 ==========
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 5,
    default: 0,
    comment: '최종 환산점수',
  })
  converted_score: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 5,
    nullable: true,
    comment: '환산점수 만점',
  })
  max_score: number;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
    comment: '환산점수 비율 (환산점수/만점*100)',
  })
  score_percentage: number;

  // ========== 평균 등급 ==========
  @Column({
    type: 'decimal',
    precision: 4,
    scale: 2,
    nullable: true,
    comment: '전체 평균 등급',
  })
  average_grade: number;

  @Column({
    type: 'decimal',
    precision: 4,
    scale: 2,
    nullable: true,
    comment: '1학년 평균 등급',
  })
  grade_1_average: number;

  @Column({
    type: 'decimal',
    precision: 4,
    scale: 2,
    nullable: true,
    comment: '2학년 평균 등급',
  })
  grade_2_average: number;

  @Column({
    type: 'decimal',
    precision: 4,
    scale: 2,
    nullable: true,
    comment: '3학년 평균 등급',
  })
  grade_3_average: number;

  // ========== 교과별 점수 ==========
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 5,
    default: 0,
    comment: '국어 환산점수',
  })
  korean_score: number;

  @Column({
    type: 'decimal',
    precision: 4,
    scale: 2,
    nullable: true,
    comment: '국어 평균 등급',
  })
  korean_average_grade: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 5,
    default: 0,
    comment: '영어 환산점수',
  })
  english_score: number;

  @Column({
    type: 'decimal',
    precision: 4,
    scale: 2,
    nullable: true,
    comment: '영어 평균 등급',
  })
  english_average_grade: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 5,
    default: 0,
    comment: '수학 환산점수',
  })
  math_score: number;

  @Column({
    type: 'decimal',
    precision: 4,
    scale: 2,
    nullable: true,
    comment: '수학 평균 등급',
  })
  math_average_grade: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 5,
    default: 0,
    comment: '사회 환산점수',
  })
  social_score: number;

  @Column({
    type: 'decimal',
    precision: 4,
    scale: 2,
    nullable: true,
    comment: '사회 평균 등급',
  })
  social_average_grade: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 5,
    default: 0,
    comment: '과학 환산점수',
  })
  science_score: number;

  @Column({
    type: 'decimal',
    precision: 4,
    scale: 2,
    nullable: true,
    comment: '과학 평균 등급',
  })
  science_average_grade: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 5,
    default: 0,
    comment: '기타 교과 환산점수',
  })
  etc_score: number;

  // ========== 반영 과목 정보 ==========
  @Column({
    type: 'int',
    default: 0,
    comment: '반영된 총 과목 수',
  })
  reflected_subject_count: number;

  @Column({
    type: 'jsonb',
    nullable: true,
    comment: '반영된 과목 상세 정보 [{subject_name, grade, score, semester}]',
  })
  reflected_subjects: object[];

  // ========== 출결/봉사 점수 ==========
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 5,
    default: 0,
    comment: '출결 점수',
  })
  attendance_score: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 5,
    default: 0,
    comment: '봉사 점수',
  })
  volunteer_score: number;

  // ========== 계산 성공 여부 ==========
  @Column({ type: 'boolean', default: true, comment: '계산 성공 여부' })
  success: boolean;

  @Column({ type: 'varchar', length: 500, nullable: true, comment: '실패 사유' })
  failure_reason: string;

  // ========== 메타 정보 ==========
  @Column({
    type: 'timestamp',
    nullable: true,
    comment: '계산 일시',
  })
  calculated_at: Date;

  @CreateDateColumn({ comment: '생성일시' })
  created_at: Date;

  @UpdateDateColumn({ comment: '수정일시' })
  updated_at: Date;

  // ========== Relations ==========
  @ManyToOne(() => MemberEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'member_id' })
  member: MemberEntity;
}
