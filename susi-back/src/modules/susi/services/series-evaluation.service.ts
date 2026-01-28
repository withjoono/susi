import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UniversityLevelEntity } from 'src/database/entities/susi/university-level.entity';
import { SeriesEvaluationCriteriaHumanitiesEntity } from 'src/database/entities/susi/series-evaluation-criteria-humanities.entity';
import { SeriesEvaluationCriteriaScienceEntity } from 'src/database/entities/susi/series-evaluation-criteria-science.entity';
import {
  CalculateSeriesEvaluationRequestDto,
  CalculateSeriesEvaluationResponseDto,
  SeriesType,
  SubjectEvaluationDto,
} from '../dto/series-evaluation.dto';

@Injectable()
export class SeriesEvaluationService {
  constructor(
    @InjectRepository(UniversityLevelEntity)
    private readonly universityLevelRepository: Repository<UniversityLevelEntity>,
    @InjectRepository(SeriesEvaluationCriteriaHumanitiesEntity)
    private readonly humanitiesCriteriaRepository: Repository<SeriesEvaluationCriteriaHumanitiesEntity>,
    @InjectRepository(SeriesEvaluationCriteriaScienceEntity)
    private readonly scienceCriteriaRepository: Repository<SeriesEvaluationCriteriaScienceEntity>,
  ) {}

  /**
   * 대학명으로 레벨 조회
   */
  async getUniversityLevel(universityName: string) {
    const university = await this.universityLevelRepository.findOne({
      where: { universityName },
    });

    if (!university) {
      throw new NotFoundException(
        `대학을 찾을 수 없습니다: ${universityName}`,
      );
    }

    return university;
  }

  /**
   * 레벨별 문과 평가 기준 조회
   */
  async getHumanitiesCriteria(level: number) {
    const criteria = await this.humanitiesCriteriaRepository.findOne({
      where: { level },
    });

    if (!criteria) {
      throw new NotFoundException(
        `문과 평가 기준을 찾을 수 없습니다 (Level ${level})`,
      );
    }

    return criteria;
  }

  /**
   * 레벨별 이과 평가 기준 조회
   */
  async getScienceCriteria(level: number) {
    const criteria = await this.scienceCriteriaRepository.findOne({
      where: { level },
    });

    if (!criteria) {
      throw new NotFoundException(
        `이과 평가 기준을 찾을 수 없습니다 (Level ${level})`,
      );
    }

    return criteria;
  }

  /**
   * 모든 대학 목록 조회 (자동완성용)
   */
  async getAllUniversities() {
    return await this.universityLevelRepository.find({
      order: { universityName: 'ASC' },
    });
  }

  /**
   * 계열 적합성 계산
   */
  async calculateSeriesEvaluation(
    dto: CalculateSeriesEvaluationRequestDto,
  ): Promise<CalculateSeriesEvaluationResponseDto> {
    // 1. 대학 레벨 조회
    const university = await this.getUniversityLevel(dto.universityName);

    // 2. 평가 기준 조회
    let criteria: any;
    let subjectMapping: Record<string, string>;

    if (dto.seriesType === SeriesType.HUMANITIES) {
      criteria = await this.getHumanitiesCriteria(university.level);
      subjectMapping = {
        국어: 'korean',
        영어: 'english',
        수학: 'math',
        사회: 'social',
        제2외국어: 'secondForeignLanguage',
      };
    } else {
      criteria = await this.getScienceCriteria(university.level);
      subjectMapping = {
        확률과통계: 'statistics',
        미적분: 'calculus',
        기하: 'geometry',
        '인공지능 수학': 'aiMath',
        물리I: 'physics1',
        물리II: 'physics2',
        화학I: 'chemistry1',
        화학II: 'chemistry2',
        생명과학I: 'biology1',
        생명과학II: 'biology2',
        지구과학I: 'earthScience1',
        지구과학II: 'earthScience2',
      };
    }

    // 3. 과목별 평가
    const subjectEvaluations: SubjectEvaluationDto[] = [];
    let totalRiskScore = 0;
    const improvementNeeded: string[] = [];

    for (const studentGrade of dto.studentGrades) {
      const criteriaKey = subjectMapping[studentGrade.subjectName];
      if (!criteriaKey) {
        continue; // 매핑되지 않은 과목은 건너뛰기
      }

      const recommendedGrade = Number(criteria[criteriaKey]);
      const difference = studentGrade.grade - recommendedGrade;

      // 위험도 계산: 차이가 클수록 높은 점수
      // 0 이하 (권장보다 좋음): 0점
      // 0~1: 10점
      // 1~2: 30점
      // 2~3: 50점
      // 3 이상: 70점
      let riskScore = 0;
      if (difference <= 0) {
        riskScore = 0;
      } else if (difference <= 1) {
        riskScore = 10;
      } else if (difference <= 2) {
        riskScore = 30;
      } else if (difference <= 3) {
        riskScore = 50;
      } else {
        riskScore = 70;
      }

      // 평가 등급
      let evaluation = '우수';
      if (difference <= 0) {
        evaluation = '우수';
      } else if (difference <= 0.5) {
        evaluation = '적합';
      } else if (difference <= 1.5) {
        evaluation = '주의';
      } else {
        evaluation = '위험';
        improvementNeeded.push(studentGrade.subjectName);
      }

      subjectEvaluations.push({
        subjectName: studentGrade.subjectName,
        studentGrade: studentGrade.grade,
        recommendedGrade,
        difference: Number(difference.toFixed(1)),
        riskScore,
        evaluation,
      });

      totalRiskScore += riskScore;
    }

    // 4. 총 위험도 정규화 (0-100)
    const maxPossibleRisk = subjectEvaluations.length * 70;
    const normalizedRisk =
      maxPossibleRisk > 0
        ? Math.round((totalRiskScore / maxPossibleRisk) * 100)
        : 0;

    // 5. 총 평가
    let overallEvaluation = '안전';
    if (normalizedRisk < 20) {
      overallEvaluation = '안전';
    } else if (normalizedRisk < 50) {
      overallEvaluation = '주의';
    } else {
      overallEvaluation = '위험';
    }

    return {
      universityName: dto.universityName,
      universityLevel: university.level,
      seriesType: dto.seriesType,
      totalRiskScore: normalizedRisk,
      overallEvaluation,
      subjectEvaluations,
      improvementNeeded,
    };
  }
}
