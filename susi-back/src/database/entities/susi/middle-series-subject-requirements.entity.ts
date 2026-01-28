import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

/**
 * 중계열별 필수/권장 과목 요구사항 엔티티
 * 예: 건축학과는 물리학I, 물리학II 필수, 기하/미적분 권장
 */
@Entity('middle_series_subject_requirements')
export class MiddleSeriesSubjectRequirementsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * 대계열 (예: 공학계열, 자연계열, 인문계열)
   */
  @Column({ name: 'grand_series', type: 'varchar', length: 50 })
  grandSeries: string;

  /**
   * 중계열 (예: 건축, 경영학, 경제학)
   */
  @Column({ name: 'middle_series', type: 'varchar', length: 100 })
  middleSeries: string;

  /**
   * 계열 타입 (humanities: 문과, science: 이과)
   */
  @Column({ name: 'series_type', type: 'varchar', length: 20 })
  seriesType: string;

  /**
   * 필수 과목 목록 (JSON 배열)
   * 예: ["물리학I", "물리학II", "화학I"]
   */
  @Column({ name: 'required_subjects', type: 'json', nullable: true })
  requiredSubjects: string[];

  /**
   * 권장 과목 목록 (JSON 배열)
   * 예: ["기하", "미적분", "확률과 통계"]
   */
  @Column({ name: 'recommended_subjects', type: 'json', nullable: true })
  recommendedSubjects: string[];

  /**
   * 설명 (선택사항)
   */
  @Column({ name: 'description', type: 'text', nullable: true })
  description: string;
}
