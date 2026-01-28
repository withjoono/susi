import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UniversityLevelEntity } from 'src/database/entities/susi/university-level.entity';
import { SeriesEvaluationCriteriaHumanitiesEntity } from 'src/database/entities/susi/series-evaluation-criteria-humanities.entity';
import { SeriesEvaluationCriteriaScienceEntity } from 'src/database/entities/susi/series-evaluation-criteria-science.entity';
import { SusiCategorySubjectNecessityEntity } from 'src/database/entities/susi/susi-category-subject-necessity.entity';
import {
  CalculateSeriesEvaluationRequestDto,
  CalculateSeriesEvaluationResponseDto,
  SeriesType,
  SubjectEvaluationDto,
  SubjectRequirementDto,
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
    @InjectRepository(SusiCategorySubjectNecessityEntity)
    private readonly categorySubjectNecessityRepository: Repository<SusiCategorySubjectNecessityEntity>,
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

    // 1-1. 중계열이 의약 또는 약학인 경우 레벨 7로 강제 설정
    const medicalSeries = ['의약', '약학'];
    const finalLevel = dto.middleSeries && medicalSeries.includes(dto.middleSeries)
      ? 7
      : university.level;

    // 2. 평가 기준 조회
    let criteria: any;
    let subjectMapping: Record<string, string>;

    if (dto.seriesType === SeriesType.HUMANITIES) {
      criteria = await this.getHumanitiesCriteria(finalLevel);
      subjectMapping = {
        국어: 'korean',
        영어: 'english',
        수학: 'math',
        사회: 'social',
        '통합사회': 'social',
        제2외국어: 'secondForeignLanguage',
        // 제2외국어 과목들
        일본어: 'secondForeignLanguage',
        '일본어Ⅰ': 'secondForeignLanguage',
        '일본어I': 'secondForeignLanguage',
        '일본어Ⅱ': 'secondForeignLanguage',
        '일본어II': 'secondForeignLanguage',
        중국어: 'secondForeignLanguage',
        '중국어Ⅰ': 'secondForeignLanguage',
        '중국어I': 'secondForeignLanguage',
        '중국어Ⅱ': 'secondForeignLanguage',
        '중국어II': 'secondForeignLanguage',
        독일어: 'secondForeignLanguage',
        '독일어Ⅰ': 'secondForeignLanguage',
        '독일어I': 'secondForeignLanguage',
        '독일어Ⅱ': 'secondForeignLanguage',
        '독일어II': 'secondForeignLanguage',
        프랑스어: 'secondForeignLanguage',
        '프랑스어Ⅰ': 'secondForeignLanguage',
        '프랑스어I': 'secondForeignLanguage',
        '프랑스어Ⅱ': 'secondForeignLanguage',
        '프랑스어II': 'secondForeignLanguage',
        스페인어: 'secondForeignLanguage',
        '스페인어Ⅰ': 'secondForeignLanguage',
        '스페인어I': 'secondForeignLanguage',
        '스페인어Ⅱ': 'secondForeignLanguage',
        '스페인어II': 'secondForeignLanguage',
        러시아어: 'secondForeignLanguage',
        '러시아어Ⅰ': 'secondForeignLanguage',
        '러시아어I': 'secondForeignLanguage',
        '러시아어Ⅱ': 'secondForeignLanguage',
        '러시아어II': 'secondForeignLanguage',
        아랍어: 'secondForeignLanguage',
        '아랍어Ⅰ': 'secondForeignLanguage',
        '아랍어I': 'secondForeignLanguage',
        '아랍어Ⅱ': 'secondForeignLanguage',
        '아랍어II': 'secondForeignLanguage',
        베트남어: 'secondForeignLanguage',
        '베트남어Ⅰ': 'secondForeignLanguage',
        '베트남어I': 'secondForeignLanguage',
        '베트남어Ⅱ': 'secondForeignLanguage',
        '베트남어II': 'secondForeignLanguage',
        한문: 'secondForeignLanguage',
        '한문Ⅰ': 'secondForeignLanguage',
        '한문I': 'secondForeignLanguage',
        '한문Ⅱ': 'secondForeignLanguage',
        '한문II': 'secondForeignLanguage',
      };
    } else {
      criteria = await this.getScienceCriteria(finalLevel);
      subjectMapping = {
        // 기본 과목명
        확률과통계: 'statistics',
        '확률과 통계': 'statistics',
        미적분: 'calculus',
        기하: 'geometry',
        '인공지능 수학': 'aiMath',
        // 물리 - 다양한 표기법 지원
        물리I: 'physics1',
        물리Ⅰ: 'physics1',
        '물리학I': 'physics1',
        '물리학Ⅰ': 'physics1',
        물리II: 'physics2',
        물리Ⅱ: 'physics2',
        '물리학II': 'physics2',
        '물리학Ⅱ': 'physics2',
        // 화학 - 다양한 표기법 지원
        화학I: 'chemistry1',
        화학Ⅰ: 'chemistry1',
        화학II: 'chemistry2',
        화학Ⅱ: 'chemistry2',
        // 생명과학 - 다양한 표기법 지원
        생명과학I: 'biology1',
        생명과학Ⅰ: 'biology1',
        생명과학II: 'biology2',
        생명과학Ⅱ: 'biology2',
        // 지구과학 - 다양한 표기법 지원
        지구과학I: 'earthScience1',
        지구과학Ⅰ: 'earthScience1',
        지구과학II: 'earthScience2',
        지구과학Ⅱ: 'earthScience2',
      };
    }

    // 3. 필수/권장 과목 조회 및 평가 (총 위험도 계산에 포함)
    let requiredSubjects: SubjectRequirementDto[] = null;
    let recommendedSubjects: SubjectRequirementDto[] = null;
    let hasDisqualification = false; // 결격 여부
    let requiredRecommendedRiskScore = 0; // 필수/권장 과목 위험도

    if (dto.middleSeries) {
      // SusiCategorySubjectNecessityEntity에서 중계열에 해당하는 과목 조회
      const categoryRequirements = await this.categorySubjectNecessityRepository.find({
        where: {
          midField: dto.middleSeries,
        },
      });

      if (categoryRequirements.length > 0) {
        // 과목명 매핑 함수 (학생부 과목명 → DB 과목명)
        const normalizeSubjectName = (studentSubject: string): string => {
          const mapping: Record<string, string> = {
            // 수학 과목
            '확률과 통계': '수학_확률과통계',
            '확률과통계': '수학_확률과통계',
            '미적분': '수학_미적',
            '기하': '수학_기하',
            // 과학 과목 (로마숫자 → 아라비아숫자)
            '물리학Ⅰ': '물리학1',
            '물리학I': '물리학1',
            '물리학Ⅱ': '물리학2',
            '물리학II': '물리학2',
            '화학Ⅰ': '화학1',
            '화학I': '화학1',
            '화학Ⅱ': '화학2',
            '화학II': '화학2',
            '생명과학Ⅰ': '생명과학1',
            '생명과학I': '생명과학1',
            '생명과학Ⅱ': '생명과학2',
            '생명과학II': '생명과학2',
            '지구과학Ⅰ': '지구과학1',
            '지구과학I': '지구과학1',
            '지구과학Ⅱ': '지구과학2',
            '지구과학II': '지구과학2',
            // 주요교과는 그대로
            '국어': '국어',
            '수학': '수학',
            '영어': '영어',
            '사회': '사회',
            '통합사회': '사회',
            '과학': '과학',
            '통합과학': '과학',
            '한국사': '한국사',
          };
          return mapping[studentSubject] || studentSubject;
        };

        // 학생이 수강한 과목 목록 (정규화된 과목명으로 매핑)
        const studentSubjectMap = new Map<string, number>();
        dto.studentGrades.forEach((sg) => {
          const normalizedName = normalizeSubjectName(sg.subjectName);
          studentSubjectMap.set(normalizedName, sg.grade);
        });

        if (dto.seriesType === SeriesType.SCIENCE) {
          // 이과: 탐구과목만 사용 (inquiry)
          const inquirySubjects = categoryRequirements.filter(
            (req) => req.subjectType === 'inquiry',
          );

          // 이과 탐구과목 평가를 위한 helper 함수
          const evaluateInquirySubject = (req: any, isRequired: boolean): SubjectRequirementDto => {
            const taken = studentSubjectMap.has(req.subjectName);
            const studentGrade = studentSubjectMap.get(req.subjectName) || null;

            let evaluation: string = null;
            let riskScore = 0;

            if (!taken) {
              // 미수강 시
              if (isRequired) {
                evaluation = '결격'; // 필수과목 미수강 → 결격
                riskScore = 100; // 결격 → 최고 위험도
                hasDisqualification = true;
              }
              // 권장과목 미수강 → null (평가 안 함)
            } else if (studentGrade) {
              // 수강했지만 등급 평가
              // DB 과목명 → criteria key 매핑
              const subjectToCriteriaKey: Record<string, string> = {
                '수학_확률과통계': 'statistics',
                '수학_미적': 'calculus',
                '수학_기하': 'geometry',
                '물리학1': 'physics1',
                '물리학2': 'physics2',
                '화학1': 'chemistry1',
                '화학2': 'chemistry2',
                '생명과학1': 'biology1',
                '생명과학2': 'biology2',
                '지구과학1': 'earthScience1',
                '지구과학2': 'earthScience2',
              };

              const criteriaKey = subjectToCriteriaKey[req.subjectName];
              if (criteriaKey && criteria[criteriaKey]) {
                const recommendedGrade = Number(criteria[criteriaKey]);
                // Spring 백엔드 로직 적용: 레벨 기반 위험도 계산
                const result = this.calculateSubjectRiskScore(studentGrade, recommendedGrade, isRequired);
                evaluation = result.evaluation;
                riskScore = result.riskScore;
              }
            }

            requiredRecommendedRiskScore += riskScore;

            return {
              subjectName: req.subjectName,
              taken,
              studentGrade,
              evaluation,
            };
          };

          // 필수과목 (necessityLevel = 1)
          const required = inquirySubjects.filter((req) => req.necessityLevel === 1);
          if (required.length > 0) {
            requiredSubjects = required.map((req) => evaluateInquirySubject(req, true));
          }

          // 권장과목 (necessityLevel = 2)
          const recommended = inquirySubjects.filter((req) => req.necessityLevel === 2);
          if (recommended.length > 0) {
            recommendedSubjects = recommended.map((req) => evaluateInquirySubject(req, false));
          }
        } else {
          // 문과: 주요교과 사용 (major), necessityLevel 1 또는 2인 것
          const majorSubjects = categoryRequirements.filter(
            (req) => req.subjectType === 'major' && (req.necessityLevel === 1 || req.necessityLevel === 2),
          );

          if (majorSubjects.length > 0) {
            // 문과는 필수/권장 구분 없이 주요교과로 통합 표시
            requiredSubjects = majorSubjects.map((req) => {
              const grades = [];
              const subjectName = req.subjectName;
              const isRequired = req.necessityLevel === 1;

              // 해당 교과의 모든 과목 등급 수집
              if (studentSubjectMap.has(subjectName)) {
                grades.push(studentSubjectMap.get(subjectName));
              }

              // 평균 계산
              const avgGrade = grades.length > 0
                ? grades.reduce((sum, g) => sum + g, 0) / grades.length
                : null;

              let evaluation: string = null;
              let riskScore = 0;

              if (!avgGrade) {
                // 미수강 시
                if (isRequired) {
                  evaluation = '결격'; // 필수교과 미수강 → 결격
                  riskScore = 100; // 결격 → 최고 위험도
                  hasDisqualification = true;
                }
                // 권장교과 미수강 → null (평가 안 함)
              } else {
                // 수강했지만 등급 평가
                // DB 교과명 → criteria key 매핑
                const subjectToCriteriaKey: Record<string, string> = {
                  '국어': 'korean',
                  '수학': 'math',
                  '영어': 'english',
                  '사회': 'social',
                  '과학': 'science',
                  '한국사': 'koreanHistory',
                  '제2외': 'secondForeignLanguage',
                };

                const criteriaKey = subjectToCriteriaKey[subjectName];
                if (criteriaKey && criteria[criteriaKey]) {
                  const recommendedGrade = Number(criteria[criteriaKey]);
                  // Spring 백엔드 로직 적용: 레벨 기반 위험도 계산
                  const result = this.calculateSubjectRiskScore(avgGrade, recommendedGrade, isRequired);
                  evaluation = result.evaluation;
                  riskScore = result.riskScore;
                }
              }

              requiredRecommendedRiskScore += riskScore;

              return {
                subjectName,
                taken: grades.length > 0,
                studentGrade: avgGrade,
                evaluation,
              };
            });
          }
        }
      }
    }

    // 4. 참조교과: 과목을 교과별로 그룹화하고 평균 계산
    // 4-1. 과목명 → 교과명 매핑
    const subjectToCategoryMapping: Record<string, string> = {
      // 국어
      국어: '국어',
      '국어Ⅰ': '국어',
      '국어I': '국어',
      '국어Ⅱ': '국어',
      '국어II': '국어',
      문학: '국어',
      독서: '국어',
      '화법과 작문': '국어',
      '언어와 매체': '국어',

      // 수학
      수학: '수학',
      '수학Ⅰ': '수학',
      '수학I': '수학',
      '수학Ⅱ': '수학',
      '수학II': '수학',
      확률과통계: '수학',
      '확률과 통계': '수학',
      미적분: '수학',
      기하: '수학',
      '인공지능 수학': '수학',

      // 영어
      영어: '영어',
      '영어Ⅰ': '영어',
      '영어I': '영어',
      '영어Ⅱ': '영어',
      '영어II': '영어',
      '영어 독해와 작문': '영어',
      '영어 회화': '영어',

      // 사회
      사회: '사회',
      통합사회: '사회',
      한국지리: '사회',
      세계지리: '사회',
      세계사: '사회',
      동아시아사: '사회',
      경제: '사회',
      정치와법: '사회',
      '정치와 법': '사회',
      사회문화: '사회',
      '사회·문화': '사회',
      생활과윤리: '사회',
      윤리와사상: '사회',

      // 과학
      과학: '과학',
      통합과학: '과학',
      물리I: '과학',
      물리Ⅰ: '과학',
      '물리학I': '과학',
      '물리학Ⅰ': '과학',
      물리II: '과학',
      물리Ⅱ: '과학',
      '물리학II': '과학',
      '물리학Ⅱ': '과학',
      화학I: '과학',
      화학Ⅰ: '과학',
      화학II: '과학',
      화학Ⅱ: '과학',
      생명과학I: '과학',
      생명과학Ⅰ: '과학',
      생명과학II: '과학',
      생명과학Ⅱ: '과학',
      지구과학I: '과학',
      지구과학Ⅰ: '과학',
      지구과학II: '과학',
      지구과학Ⅱ: '과학',

      // 제2외국어
      일본어: '제2외국어',
      '일본어Ⅰ': '제2외국어',
      '일본어I': '제2외국어',
      '일본어Ⅱ': '제2외국어',
      '일본어II': '제2외국어',
      중국어: '제2외국어',
      '중국어Ⅰ': '제2외국어',
      '중국어I': '제2외국어',
      '중국어Ⅱ': '제2외국어',
      '중국어II': '제2외국어',
      독일어: '제2외국어',
      '독일어Ⅰ': '제2외국어',
      '독일어I': '제2외국어',
      '독일어Ⅱ': '제2외국어',
      '독일어II': '제2외국어',
      프랑스어: '제2외국어',
      '프랑스어Ⅰ': '제2외국어',
      '프랑스어I': '제2외국어',
      '프랑스어Ⅱ': '제2외국어',
      '프랑스어II': '제2외국어',
      스페인어: '제2외국어',
      '스페인어Ⅰ': '제2외국어',
      '스페인어I': '제2외국어',
      '스페인어Ⅱ': '제2외국어',
      '스페인어II': '제2외국어',
      러시아어: '제2외국어',
      '러시아어Ⅰ': '제2외국어',
      '러시아어I': '제2외국어',
      '러시아어Ⅱ': '제2외국어',
      '러시아어II': '제2외국어',
      아랍어: '제2외국어',
      '아랍어Ⅰ': '제2외국어',
      '아랍어I': '제2외국어',
      '아랍어Ⅱ': '제2외국어',
      '아랍어II': '제2외국어',
      베트남어: '제2외국어',
      '베트남어Ⅰ': '제2외국어',
      '베트남어I': '제2외국어',
      '베트남어Ⅱ': '제2외국어',
      '베트남어II': '제2외국어',
      한문: '제2외국어',
      '한문Ⅰ': '제2외국어',
      '한문I': '제2외국어',
      '한문Ⅱ': '제2외국어',
      '한문II': '제2외국어',
    };

    // 4-2. 교과별 등급 수집
    const categoryGrades = new Map<string, number[]>();

    for (const studentGrade of dto.studentGrades) {
      const category = subjectToCategoryMapping[studentGrade.subjectName];
      if (!category) {
        continue; // 매핑되지 않은 과목은 건너뛰기
      }

      if (!categoryGrades.has(category)) {
        categoryGrades.set(category, []);
      }
      categoryGrades.get(category)!.push(studentGrade.grade);
    }

    // 4-3. 교과별 평균 등급 계산 및 평가
    const subjectEvaluations: SubjectEvaluationDto[] = [];
    let referenceSubjectRiskScore = 0; // 참조교과 위험도
    const improvementNeeded: string[] = [];

    for (const [category, grades] of categoryGrades.entries()) {
      // 평균 등급 계산
      const avgGrade = grades.reduce((sum, g) => sum + g, 0) / grades.length;

      // 평가 기준에서 권장 등급 가져오기
      const criteriaKey = subjectMapping[category];
      if (!criteriaKey) {
        continue; // 평가 기준에 없는 교과는 건너뛰기
      }

      const recommendedGrade = Number(criteria[criteriaKey]);
      const difference = avgGrade - recommendedGrade;

      // Spring 백엔드 로직 적용: 대학 레벨 기반 참조교과 위험도 계산
      const result = this.calculateSubjectRiskScore(avgGrade, recommendedGrade, false);
      const riskScore = result.riskScore;
      const evaluation = result.evaluation;

      if (evaluation === '위험') {
        improvementNeeded.push(category);
      }

      subjectEvaluations.push({
        subjectName: category,
        studentGrade: Number(avgGrade.toFixed(1)),
        recommendedGrade,
        difference: Number(difference.toFixed(1)),
        riskScore,
        evaluation,
      });

      referenceSubjectRiskScore += riskScore;
    }

    // 5. 총 위험도 계산 (필수/권장 + 참조교과)
    const totalRiskScore = requiredRecommendedRiskScore + referenceSubjectRiskScore;

    // 필수/권장 과목 개수 + 참조교과 개수
    const requiredCount = requiredSubjects ? requiredSubjects.length : 0;
    const recommendedCount = recommendedSubjects ? recommendedSubjects.length : 0;
    const referenceCount = subjectEvaluations.length;
    const totalSubjectCount = requiredCount + recommendedCount + referenceCount;

    // 5-1. 총 위험도 정규화 (0-100)
    // 최대 가능 위험도: 결격(100) 또는 위험(70)이 최대
    const maxPossibleRisk = totalSubjectCount * 100; // 모두 결격이라고 가정한 최대값
    const normalizedRisk =
      maxPossibleRisk > 0
        ? Math.round((totalRiskScore / maxPossibleRisk) * 100)
        : 0;

    // 5-2. 총 평가
    let overallEvaluation = '안전';
    if (hasDisqualification) {
      // 필수과목/교과 결격이 하나라도 있으면 무조건 "결격"
      overallEvaluation = '결격';
    } else if (normalizedRisk < 20) {
      overallEvaluation = '안전';
    } else if (normalizedRisk < 50) {
      overallEvaluation = '주의';
    } else {
      overallEvaluation = '위험';
    }

    return {
      universityName: dto.universityName,
      universityLevel: finalLevel,
      seriesType: dto.seriesType,
      totalRiskScore: normalizedRisk,
      overallEvaluation,
      subjectEvaluations,
      improvementNeeded,
      requiredSubjects,
      recommendedSubjects,
    };
  }

  /**
   * 필수/권장 과목 위험도 계산 (Spring 백엔드 로직)
   * @param studentGrade 학생의 과목 등급
   * @param recommendedGrade 권장 등급
   * @param isRequired 필수 여부 (true: 필수, false: 권장)
   * @returns 평가 결과 및 위험도 점수
   */
  private calculateSubjectRiskScore(
    studentGrade: number,
    recommendedGrade: number,
    isRequired: boolean,
  ): { evaluation: string; riskScore: number } {
    // Spring 로직: essentialFlag (1: 권장, 2: 필수)
    const essentialFlag = isRequired ? 2 : 1;

    // 등급 차이 계산 (권장등급 - 내등급)
    // 양수: 내 등급이 권장보다 낮음 (나쁨)
    // 음수: 내 등급이 권장보다 높음 (좋음)
    const diff = recommendedGrade - studentGrade;

    let riskScore = 0;
    let evaluation = '';

    // Spring 백엔드 calculateRiskScore 로직 적용
    if (diff >= 3) {
      riskScore = essentialFlag === 1 ? 40 : 80; // 권장: 40, 필수: 80
      evaluation = '위험';
    } else if (diff >= 2) {
      riskScore = essentialFlag === 1 ? 40 : 70; // 권장: 40, 필수: 70
      evaluation = '위험';
    } else if (diff >= 1) {
      riskScore = essentialFlag === 1 ? 30 : 60; // 권장: 30, 필수: 60
      evaluation = '주의';
    } else if (diff >= 0) {
      riskScore = essentialFlag === 1 ? 30 : 50; // 권장: 30, 필수: 50
      evaluation = '주의';
    } else if (diff >= -1) {
      riskScore = essentialFlag === 1 ? 20 : 40; // 권장: 20, 필수: 40
      evaluation = '적합';
    } else if (diff >= -2) {
      riskScore = essentialFlag === 1 ? 20 : 30; // 권장: 20, 필수: 30
      evaluation = '적합';
    } else if (diff >= -3) {
      riskScore = essentialFlag === 1 ? 10 : 20; // 권장: 10, 필수: 20
      evaluation = '우수';
    } else if (diff >= -4) {
      riskScore = essentialFlag === 1 ? 10 : 10; // 권장: 10, 필수: 10
      evaluation = '우수';
    } else {
      riskScore = 0; // 매우 우수
      evaluation = '우수';
    }

    return { evaluation, riskScore };
  }
}
