import { OfficerTicketEntity } from '../../../database/entities/officer-evaluation/officer-ticket.entity';
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OfficerEvaluationCommentEntity } from 'src/database/entities/officer-evaluation/officer-evaluation-comment.entity';
import { OfficerEvaluationScoreEntity } from 'src/database/entities/officer-evaluation/officer-evaluation-score.entity';
import { OfficerEvaluationSurveyEntity } from 'src/database/entities/officer-evaluation/officer-evaluation-survey.entity';
import { OfficerEvaluationEntity } from 'src/database/entities/officer-evaluation/officer-evaluation.entity';
import { Repository } from 'typeorm';
import { GetOfficerEvaluationsResponseDto } from '../dtos/officer-evaluations-response.dto';
import { OfficerListEntity } from 'src/database/entities/officer-evaluation/officer-list.entity';
import { GetOfficerListResponseDto } from '../dtos/officer-list-response.dto';
import { GetTicketCountResponseDto } from '../dtos/ticket-count-response.dto';
import { UseTicketReqDto } from '../dtos/use-ticket.dto';
import { SchoolRecordSubjectLearningEntity } from 'src/database/entities/schoolrecord/schoolrecord-subject-learning.entity';
import { MemberUploadFileListEntity } from 'src/database/entities/member/member-file';
import { SmsService } from '../../sms/sms.service';
import { SelfEvaluationBodyDto } from '../dtos/self-evaluation.dto';
import { OfficerEvaluationBodyDto } from '../dtos/officer-evaluation.dto';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';

@Injectable()
export class OfficerEvaluationService {
  private readonly logger = new Logger(OfficerEvaluationService.name);
  private readonly gcsPublicUrl: string;

  constructor(
    @InjectRepository(OfficerEvaluationSurveyEntity)
    private officerEvaluationSurveyRepository: Repository<OfficerEvaluationSurveyEntity>,
    @InjectRepository(OfficerEvaluationCommentEntity)
    private officerEvaluationCommentRepository: Repository<OfficerEvaluationCommentEntity>,
    @InjectRepository(OfficerEvaluationScoreEntity)
    private officerEvaluationScoreRepository: Repository<OfficerEvaluationScoreEntity>,
    @InjectRepository(OfficerEvaluationEntity)
    private officerEvaluationRepository: Repository<OfficerEvaluationEntity>,
    @InjectRepository(OfficerListEntity)
    private officerRepository: Repository<OfficerListEntity>,
    @InjectRepository(OfficerTicketEntity)
    private officerTicketRepository: Repository<OfficerTicketEntity>,
    @InjectRepository(SchoolRecordSubjectLearningEntity)
    private schoolRecordSubjectLearningRepository: Repository<SchoolRecordSubjectLearningEntity>,
    @InjectRepository(MemberUploadFileListEntity)
    private memberUploadFileListRepository: Repository<MemberUploadFileListEntity>,

    private smsService: SmsService,
    private configService: ConfigService<AllConfigType>,
  ) {
    const gcsConfig = this.configService.get('gcsUpload', { infer: true });
    this.gcsPublicUrl =
      gcsConfig?.publicUrl || `https://storage.googleapis.com/${gcsConfig?.bucketName || ''}`;
  }

  /**
   * 주어진 member_id로 평가 목록을 가져옴
   * @param memberId - 멤버 ID
   * @returns 평가 목록
   */
  async getEvaluationsByMemberId(memberId: number): Promise<GetOfficerEvaluationsResponseDto[]> {
    const evaluations = await this.officerEvaluationRepository
      .createQueryBuilder('evaluation')
      .leftJoinAndSelect('officer_list_tb', 'officer', 'evaluation.member_id = officer.member_id')
      .where('evaluation.student_id = :memberId', { memberId })
      .select([
        'evaluation.id',
        'evaluation.series',
        'evaluation.status',
        'evaluation.update_dt',
        'evaluation.member_id',
        'officer.officer_name',
        'officer.officer_profile_image',
        "(SELECT COUNT(*) FROM officer_student_evaludate_relation_tb e WHERE e.status = 'READY' AND e.member_id = evaluation.member_id AND e.update_dt <= evaluation.update_dt) AS remaining_evaluations",
      ])
      .getRawMany();

    return evaluations.map((evaluation) => ({
      id: evaluation.evaluation_id,
      series: evaluation.evaluation_series,
      status: evaluation.evaluation_status,
      update_dt: evaluation.evaluation_update_dt,
      officer_id: evaluation.evaluation_member_id,
      officer_name: evaluation.officer_officer_name,
      officer_profile_image: evaluation.officer_officer_profile_image,
      remaining_evaluations: parseInt(evaluation.remaining_evaluations, 10), // 남은 평가 수 추가
    }));
  }

  /**
   * 사정관 목록을 가져옴
   * @returns 사정관 목록
   */
  async getOfficerList(): Promise<GetOfficerListResponseDto[]> {
    const officers = await this.officerRepository
      .createQueryBuilder('officer')
      .select([
        'officer.member_id',
        'officer.officer_name',
        'officer.officer_profile_image',
        'officer.university',
        'officer.education',
        "(SELECT COUNT(*) FROM officer_student_evaludate_relation_tb e WHERE e.status = 'READY' AND e.member_id = officer.member_id) AS remaining_evaluations",
      ])
      .where('officer.del_yn = :delYn', { delYn: 'N' })
      .getRawMany();

    return officers.map((officer) => ({
      officer_id: officer.officer_member_id,
      officer_name: officer.officer_officer_name,
      officer_profile_image: officer.officer_officer_profile_image,
      officer_university: officer.officer_university,
      officer_education: officer.officer_education,
      remaining_evaluations: parseInt(officer.remaining_evaluations, 10),
    }));
  }

  /**
   * 사정관이 받은 평가 신청 목록을 가져옴
   * @param officerMemberId - 사정관의 member_id
   * @returns 평가 신청 목록
   */
  async getEvaluationsForOfficer(officerMemberId: string): Promise<{
    studentId: number;
    studentName: string;
    series: string;
    progressStatus: string;
    readyCount: number;
    phone: string;
    email: string;
    evaluationId: number;
    updateDt: Date;
  }[]> {
    const evaluations = await this.officerEvaluationRepository
      .createQueryBuilder('evaluation')
      .leftJoin('member_tb', 'student', 'evaluation.student_id = student.id')
      .where('evaluation.member_id = :officerMemberId', { officerMemberId: Number(officerMemberId) })
      .select([
        'evaluation.id AS evaluation_id',
        'evaluation.student_id AS student_id',
        'student.nickname AS student_name',
        'evaluation.series AS series',
        'evaluation.status AS progress_status',
        'evaluation.update_dt AS update_dt',
        'student.phone AS phone',
        'student.email AS email',
        "(SELECT COUNT(*) FROM officer_student_evaludate_relation_tb e WHERE e.status = 'READY' AND e.member_id = :officerMemberId AND e.update_dt <= evaluation.update_dt) AS ready_count",
      ])
      .setParameter('officerMemberId', Number(officerMemberId))
      .orderBy('evaluation.update_dt', 'DESC')
      .getRawMany();

    return evaluations.map((e) => ({
      evaluationId: e.evaluation_id,
      studentId: e.student_id,
      studentName: e.student_name || '이름 없음',
      series: e.series,
      progressStatus: e.progress_status,
      readyCount: parseInt(e.ready_count, 10),
      phone: e.phone || '',
      email: e.email || '',
      updateDt: e.update_dt,
    }));
  }

  /**
   * 주어진 id로 평가의 comments를 가져옴
   * @param id - 평가 ID
   */
  async getEvaluationCommentsByID(id: number): Promise<OfficerEvaluationCommentEntity[]> {
    const comments = await this.officerEvaluationCommentRepository.find({
      where: { officer_relation_id: id },
    });
    return comments;
  }

  /**
   * 주어진 id로 평가의 scores를 가져옴
   * @param id - 평가 ID
   */
  async getEvaluationScoresByID(id: number): Promise<OfficerEvaluationScoreEntity[]> {
    const scores = await this.officerEvaluationScoreRepository.find({
      where: { officer_relation_id: id },
    });
    return scores;
  }

  /**
   * 평가의 질문목록을 가져옴
   */
  async getEvaluationSurvey(): Promise<OfficerEvaluationSurveyEntity[]> {
    const survey = await this.officerEvaluationSurveyRepository.find();
    return survey;
  }

  /**
   * 티켓 갯수 조회
   */
  async getTicketCount(memberId: string): Promise<GetTicketCountResponseDto> {
    const ticket = await this.officerTicketRepository.findOne({
      where: {
        member_id: Number(memberId),
      },
    });
    return {
      count: ticket?.ticket_count ?? 0,
    };
  }

  /**
   * 티켓 사용(평가 신청)
   */
  async useTicket(memberId: string, body: UseTicketReqDto): Promise<void> {
    const ticket = await this.officerTicketRepository.findOne({
      where: {
        member_id: Number(memberId),
      },
    });
    if (!ticket || ticket.ticket_count < 1) {
      throw new BadRequestException('사용가능한 이용권이 없습니다.');
    }

    const schoolRecords = await this.schoolRecordSubjectLearningRepository.find({
      where: {
        member: { id: Number(memberId) },
      },
    });
    if (schoolRecords.length < 1) {
      throw new BadRequestException('등록된 생기부가 존재하지 않습니다.');
    }

    const officer = await this.officerRepository.findOne({
      where: {
        member_id: Number(body.officerId),
      },
      relations: {
        member: true,
      },
    });

    if (!officer) {
      throw new BadRequestException('해당 평가자가 존재하지 않습니다.');
    }

    const exist = await this.officerEvaluationRepository.find({
      where: {
        student_id: Number(memberId),
        member_id: officer.member.id,
        status: 'READY',
      },
    });

    if (exist.length) {
      throw new BadRequestException('이미 진행중인 평가가 존재합니다.');
    }

    await this.officerEvaluationRepository.save(
      this.officerEvaluationRepository.create({
        member_id: officer.member.id,
        student_id: Number(memberId),
        series: body.series,
        status: 'READY',
        create_dt: new Date(),
        update_dt: new Date(),
      }),
    );

    ticket.ticket_count -= 1;
    await this.officerTicketRepository.save(ticket);

    try {
      await this.smsService.sendMessage(
        '학생이 학생부 평가를 신청하였습니다. 확인바랍니다.',
        officer.member.phone,
      );
    } catch (e) {
      this.logger.error(
        `{id: ${officer.id}, name: ${officer.officer_name}, phone: ${officer.member.phone}} 평가자에게 메세지 발송에 실패했습니다. 에러 내용 ${e}`,
      );
    }
  }

  async saveEvaluationBySelf(memberId: string, dto: SelfEvaluationBodyDto): Promise<void> {
    let evaluation = await this.officerEvaluationRepository.findOne({
      where: {
        member_id: Number(memberId),
        student_id: Number(memberId),
        status: 'COMPLETE',
      },
    });

    if (evaluation) {
      // 있으면 계열 업데이트 및 기존 스코어 제거
      evaluation.series = dto.series;
      evaluation.update_dt = new Date();
      await this.officerEvaluationRepository.save(evaluation);

      await this.officerEvaluationScoreRepository.delete({
        officer_relation_id: evaluation.id,
      });
    } else {
      // 없으면 생성
      evaluation = this.officerEvaluationRepository.create({
        member_id: Number(memberId),
        student_id: Number(memberId),
        status: 'COMPLETE',
        series: dto.series,
        create_dt: new Date(),
        update_dt: new Date(),
      });
      evaluation = await this.officerEvaluationRepository.save(evaluation);
    }

    // 새 스코어 저장
    const scores = dto.scores.map((score) =>
      this.officerEvaluationScoreRepository.create({
        officer_relation_id: evaluation.id,
        bottom_survey_id: score.surveyId,
        score: score.score,
      }),
    );

    await this.officerEvaluationScoreRepository.save(scores);
  }

  async saveEvaluationByOfficer(memberId: string, dto: OfficerEvaluationBodyDto): Promise<void> {
    const officer = await this.officerRepository.findOne({
      where: {
        member_id: Number(memberId),
      },
    });
    if (!officer) {
      throw new BadRequestException('평가자가 아닙니다.');
    }

    const evaluation = await this.officerEvaluationRepository.findOne({
      where: {
        member_id: Number(officer.member_id),
        student_id: Number(dto.studentId),
        series: dto.series,
      },
    });

    if (!evaluation) {
      throw new BadRequestException('평가 신청이 존재하지 않습니다.');
    }

    evaluation.status = dto.saveType === 0 ? 'PROGRESS' : 'COMPLETE';
    evaluation.update_dt = new Date();
    await this.officerEvaluationRepository.save(evaluation);
    await this.officerEvaluationScoreRepository.delete({
      officer_relation_id: evaluation.id,
    });
    await this.officerEvaluationCommentRepository.delete({
      officer_relation_id: evaluation.id,
    });

    // 새 스코어 저장
    const scores = dto.scores.map((score) =>
      this.officerEvaluationScoreRepository.create({
        officer_relation_id: evaluation.id,
        bottom_survey_id: score.surveyId,
        score: score.score,
      }),
    );
    // 새 코멘트 저장
    const comments = dto.comments.map((comment) =>
      this.officerEvaluationCommentRepository.create({
        officer_relation_id: evaluation.id,
        main_survey_type: comment.mainSurveyType,
        comment: comment.comment,
      }),
    );

    await this.officerEvaluationScoreRepository.save(scores);
    await this.officerEvaluationCommentRepository.save(comments);
  }

  /**
   * 학생의 생기부 파일 다운로드 URL 조회 (사정관용)
   * @param officerMemberId - 사정관의 member_id
   * @param studentId - 학생의 member_id
   * @returns 다운로드 URL 및 파일명
   */
  async getStudentSchoolRecordFile(
    officerMemberId: string,
    studentId: string,
  ): Promise<{ url: string; fileName: string }> {
    // 사정관 여부 확인
    const officer = await this.officerRepository.findOne({
      where: { member_id: Number(officerMemberId) },
    });
    if (!officer) {
      throw new BadRequestException('평가자가 아닙니다.');
    }

    // 해당 학생에 대한 평가 신청이 있는지 확인
    const evaluation = await this.officerEvaluationRepository.findOne({
      where: {
        member_id: Number(officerMemberId),
        student_id: Number(studentId),
      },
    });
    if (!evaluation) {
      throw new BadRequestException('해당 학생에 대한 평가 신청이 존재하지 않습니다.');
    }

    // 학생의 생기부 파일 조회
    const file = await this.memberUploadFileListRepository.findOne({
      where: {
        member_id: Number(studentId),
        file_type: 'school-record-pdf',
      },
      order: {
        create_dt: 'DESC', // 가장 최근 파일
      },
    });

    if (!file) {
      throw new NotFoundException('학생의 생기부 파일이 존재하지 않습니다.');
    }

    // GCS URL 생성
    const url = `${this.gcsPublicUrl}/${file.file_path}`;

    return {
      url,
      fileName: file.file_name,
    };
  }
}
