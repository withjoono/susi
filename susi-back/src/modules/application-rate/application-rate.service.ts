import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios from 'axios';
import * as cheerio from 'cheerio';

import { ApplicationRate } from './entities/application-rate.entity';
import { ApplicationRateHistory } from './entities/application-rate-history.entity';
import {
  ApplicationRateResponseDto,
  ApplicationRateChangeDto,
  GetApplicationRateQueryDto,
} from './dto/application-rate.dto';

interface CrawlSource {
  universityCode: string;
  universityName: string;
  sourceUrl: string;
  isActive: boolean;
}

interface ParsedRateData {
  departmentName: string;
  admissionType: string;
  recruitmentCount: number;
  applicationCount: number;
  competitionRate: number;
}

@Injectable()
export class ApplicationRateService {
  private readonly logger = new Logger(ApplicationRateService.name);

  // 크롤링 대상 URL 목록 - 2026 수시 경쟁률 (UWAY 기반)
  private readonly crawlSources: CrawlSource[] = [
    // 가
    {
      universityCode: '10190551',
      universityName: '가천대학교',
      sourceUrl: 'https://addon.jinhakapply.com/RatioV1/RatioH/Ratio10190551.html',
      isActive: true,
    },
    {
      universityCode: '10180521',
      universityName: '가톨릭대학교',
      sourceUrl: 'https://addon.jinhakapply.com/RatioV1/RatioH/Ratio10180521.html',
      isActive: true,
    },
    // 건
    {
      universityCode: '10080311',
      universityName: '건국대학교(서울)',
      sourceUrl: 'https://addon.jinhakapply.com/RatioV1/RatioH/Ratio10080311.html',
      isActive: true,
    },
    {
      universityCode: '10090831',
      universityName: '건국대학교(글로컬)',
      sourceUrl: 'https://addon.jinhakapply.com/RatioV1/RatioH/Ratio10090831.html',
      isActive: true,
    },
    // 경
    {
      universityCode: '10130521',
      universityName: '경남대학교',
      sourceUrl: 'https://addon.jinhakapply.com/RatioV1/RatioH/Ratio10130521.html',
      isActive: true,
    },
    {
      universityCode: '10100521',
      universityName: '경북대학교',
      sourceUrl: 'https://addon.jinhakapply.com/RatioV1/RatioH/Ratio10100521.html',
      isActive: true,
    },
    {
      universityCode: '10080521',
      universityName: '경희대학교',
      sourceUrl: 'https://addon.jinhakapply.com/RatioV1/RatioH/Ratio10080521.html',
      isActive: true,
    },
    // 고
    {
      universityCode: '10080111',
      universityName: '고려대학교(서울)',
      sourceUrl: 'https://addon.jinhakapply.com/RatioV1/RatioH/Ratio10080111.html',
      isActive: true,
    },
    {
      universityCode: '10040821',
      universityName: '고려대학교(세종)',
      sourceUrl: 'https://addon.jinhakapply.com/RatioV1/RatioH/Ratio10040821.html',
      isActive: true,
    },
    // 광
    {
      universityCode: '10150521',
      universityName: '광운대학교',
      sourceUrl: 'https://addon.jinhakapply.com/RatioV1/RatioH/Ratio10150521.html',
      isActive: true,
    },
    // 국
    {
      universityCode: '10080521',
      universityName: '국민대학교',
      sourceUrl: 'https://addon.jinhakapply.com/RatioV1/RatioH/Ratio10080612.html',
      isActive: true,
    },
    // 단
    {
      universityCode: '10080721',
      universityName: '단국대학교(죽전)',
      sourceUrl: 'https://addon.jinhakapply.com/RatioV1/RatioH/Ratio10080721.html',
      isActive: true,
    },
    // 덕
    {
      universityCode: '10080811',
      universityName: '덕성여자대학교',
      sourceUrl: 'https://addon.jinhakapply.com/RatioV1/RatioH/Ratio10080811.html',
      isActive: true,
    },
    // 동
    {
      universityCode: '10080911',
      universityName: '동국대학교(서울)',
      sourceUrl: 'https://addon.jinhakapply.com/RatioV1/RatioH/Ratio10080911.html',
      isActive: true,
    },
    {
      universityCode: '10130712',
      universityName: '동아대학교',
      sourceUrl: 'https://addon.jinhakapply.com/RatioV1/RatioH/Ratio10130712.html',
      isActive: true,
    },
    // 명
    {
      universityCode: '10081011',
      universityName: '명지대학교',
      sourceUrl: 'https://addon.jinhakapply.com/RatioV1/RatioH/Ratio10081011.html',
      isActive: true,
    },
    // 부
    {
      universityCode: '10130111',
      universityName: '부산대학교',
      sourceUrl: 'https://addon.jinhakapply.com/RatioV1/RatioH/Ratio10130111.html',
      isActive: true,
    },
    // 상
    {
      universityCode: '10081211',
      universityName: '상명대학교(서울)',
      sourceUrl: 'https://addon.jinhakapply.com/RatioV1/RatioH/Ratio10081211.html',
      isActive: true,
    },
    // 서
    {
      universityCode: '10080211',
      universityName: '서강대학교',
      sourceUrl: 'https://addon.jinhakapply.com/RatioV1/RatioH/Ratio10080211.html',
      isActive: true,
    },
    {
      universityCode: '10080011',
      universityName: '서울대학교',
      sourceUrl: 'https://addon.jinhakapply.com/RatioV1/RatioH/Ratio10080011.html',
      isActive: true,
    },
    {
      universityCode: '10081411',
      universityName: '서울시립대학교',
      sourceUrl: 'https://addon.jinhakapply.com/RatioV1/RatioH/Ratio10081411.html',
      isActive: true,
    },
    {
      universityCode: '10081511',
      universityName: '성균관대학교',
      sourceUrl: 'https://addon.jinhakapply.com/RatioV1/RatioH/Ratio10081511.html',
      isActive: true,
    },
    {
      universityCode: '10081611',
      universityName: '세종대학교',
      sourceUrl: 'https://addon.jinhakapply.com/RatioV1/RatioH/Ratio10081611.html',
      isActive: true,
    },
    // 숙
    {
      universityCode: '10081711',
      universityName: '숙명여자대학교',
      sourceUrl: 'https://addon.jinhakapply.com/RatioV1/RatioH/Ratio10081711.html',
      isActive: true,
    },
    // 숭
    {
      universityCode: '10081811',
      universityName: '숭실대학교',
      sourceUrl: 'https://addon.jinhakapply.com/RatioV1/RatioH/Ratio10081811.html',
      isActive: true,
    },
    // 아
    {
      universityCode: '10081911',
      universityName: '아주대학교',
      sourceUrl: 'https://addon.jinhakapply.com/RatioV1/RatioH/Ratio10081911.html',
      isActive: true,
    },
    // 연
    {
      universityCode: '10080121',
      universityName: '연세대학교(서울)',
      sourceUrl: 'https://addon.jinhakapply.com/RatioV1/RatioH/Ratio10080121.html',
      isActive: true,
    },
    {
      universityCode: '10120821',
      universityName: '연세대학교(미래)',
      sourceUrl: 'https://addon.jinhakapply.com/RatioV1/RatioH/Ratio10120821.html',
      isActive: true,
    },
    // 이
    {
      universityCode: '10082111',
      universityName: '이화여자대학교',
      sourceUrl: 'https://addon.jinhakapply.com/RatioV1/RatioH/Ratio10082111.html',
      isActive: true,
    },
    // 인
    {
      universityCode: '10082211',
      universityName: '인하대학교',
      sourceUrl: 'https://addon.jinhakapply.com/RatioV1/RatioH/Ratio10082211.html',
      isActive: true,
    },
    // 중
    {
      universityCode: '10082311',
      universityName: '중앙대학교(서울)',
      sourceUrl: 'https://addon.jinhakapply.com/RatioV1/RatioH/Ratio10082311.html',
      isActive: true,
    },
    // 한
    {
      universityCode: '10082511',
      universityName: '한국외국어대학교(서울)',
      sourceUrl: 'https://addon.jinhakapply.com/RatioV1/RatioH/Ratio10082511.html',
      isActive: true,
    },
    {
      universityCode: '10082611',
      universityName: '한양대학교(서울)',
      sourceUrl: 'https://addon.jinhakapply.com/RatioV1/RatioH/Ratio10082611.html',
      isActive: true,
    },
    {
      universityCode: '10040812',
      universityName: '한양대학교(ERICA)',
      sourceUrl: 'https://addon.jinhakapply.com/RatioV1/RatioH/Ratio10040812.html',
      isActive: true,
    },
    // 홍
    {
      universityCode: '10082711',
      universityName: '홍익대학교(서울)',
      sourceUrl: 'https://addon.jinhakapply.com/RatioV1/RatioH/Ratio10082711.html',
      isActive: true,
    },
  ];

  constructor(
    @InjectRepository(ApplicationRate)
    private readonly applicationRateRepository: Repository<ApplicationRate>,
    @InjectRepository(ApplicationRateHistory)
    private readonly historyRepository: Repository<ApplicationRateHistory>,
  ) {}

  /**
   * 5분마다 크롤링 실행 (비활성화됨)
   */
  // @Cron(CronExpression.EVERY_5_MINUTES)
  async scheduledCrawl(): Promise<void> {
    this.logger.log('Starting scheduled crawl for application rates...');

    for (const source of this.crawlSources) {
      if (!source.isActive) continue;

      try {
        await this.crawlAndSave(source);
        this.logger.log(`Successfully crawled: ${source.universityName}`);
      } catch (error) {
        this.logger.error(`Failed to crawl ${source.universityName}: ${error.message}`);
      }
    }
  }

  /**
   * 특정 대학 크롤링 및 저장
   */
  async crawlAndSave(source: CrawlSource): Promise<void> {
    const crawledAt = new Date();
    const parsedData = await this.crawlApplicationRates(source.sourceUrl);

    // 기존 데이터 조회 (변동 감지용)
    const existingRates = await this.applicationRateRepository.find({
      where: { universityCode: source.universityCode },
    });

    const existingMap = new Map<string, ApplicationRate>();
    existingRates.forEach((rate) => {
      const key = `${rate.departmentName}_${rate.admissionType}`;
      existingMap.set(key, rate);
    });

    // 데이터 저장 및 변동 기록
    for (const data of parsedData) {
      const key = `${data.departmentName}_${data.admissionType}`;
      const existing = existingMap.get(key);

      if (existing) {
        // 변동이 있는 경우 히스토리 기록
        if (existing.applicationCount !== data.applicationCount) {
          await this.recordHistory(existing, data, crawledAt);
        }

        // 기존 데이터 업데이트
        await this.applicationRateRepository.update(existing.id, {
          recruitmentCount: data.recruitmentCount,
          applicationCount: data.applicationCount,
          competitionRate: data.competitionRate,
          crawledAt,
        });
      } else {
        // 새 데이터 삽입
        await this.applicationRateRepository.save({
          universityCode: source.universityCode,
          universityName: source.universityName,
          departmentName: data.departmentName,
          admissionType: data.admissionType,
          recruitmentCount: data.recruitmentCount,
          applicationCount: data.applicationCount,
          competitionRate: data.competitionRate,
          sourceUrl: source.sourceUrl,
          crawledAt,
        });
      }
    }
  }

  /**
   * 변동 히스토리 기록
   */
  private async recordHistory(
    existing: ApplicationRate,
    newData: ParsedRateData,
    recordedAt: Date,
  ): Promise<void> {
    await this.historyRepository.save({
      universityCode: existing.universityCode,
      universityName: existing.universityName,
      departmentName: existing.departmentName,
      admissionType: existing.admissionType,
      recruitmentCount: newData.recruitmentCount,
      applicationCount: newData.applicationCount,
      previousApplicationCount: existing.applicationCount,
      competitionRate: newData.competitionRate,
      previousCompetitionRate: Number(existing.competitionRate),
      changeAmount: newData.applicationCount - existing.applicationCount,
      recordedAt,
    });
  }

  /**
   * 웹 페이지 크롤링 및 파싱
   */
  async crawlApplicationRates(url: string): Promise<ParsedRateData[]> {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
      },
      timeout: 30000,
    });

    const $ = cheerio.load(response.data);
    const results: ParsedRateData[] = [];

    // 테이블 파싱 - 진학어플라이 경쟁률 페이지 구조 기준
    $('table tr').each((_, row) => {
      const cells = $(row).find('td');

      if (cells.length >= 5) {
        const departmentName = $(cells[0]).text().trim() || $(cells[1]).text().trim();
        const admissionType = cells.length > 5 ? $(cells[1]).text().trim() : '';

        // 모집인원, 지원인원, 경쟁률 추출 (마지막 3개 셀 기준)
        const lastCells = cells.slice(-3);
        const recruitmentText = $(lastCells[0]).text().trim().replace(/,/g, '');
        const applicationText = $(lastCells[1]).text().trim().replace(/,/g, '');
        const rateText = $(lastCells[2]).text().trim().replace(':1', '').replace(/,/g, '');

        const recruitmentCount = parseInt(recruitmentText, 10) || 0;
        const applicationCount = parseInt(applicationText, 10) || 0;
        const competitionRate = parseFloat(rateText) || 0;

        // 유효한 데이터만 추가 (모집인원이 있거나 지원인원이 있는 경우)
        if (departmentName && (recruitmentCount > 0 || applicationCount > 0)) {
          results.push({
            departmentName,
            admissionType,
            recruitmentCount,
            applicationCount,
            competitionRate,
          });
        }
      }
    });

    return results;
  }

  /**
   * 경쟁률 데이터 조회
   */
  async getApplicationRates(
    query: GetApplicationRateQueryDto,
  ): Promise<ApplicationRateResponseDto[]> {
    const queryBuilder = this.applicationRateRepository.createQueryBuilder('rate');

    if (query.universityCode) {
      queryBuilder.andWhere('rate.universityCode = :code', { code: query.universityCode });
    }

    if (query.departmentName) {
      queryBuilder.andWhere('rate.departmentName LIKE :dept', {
        dept: `%${query.departmentName}%`,
      });
    }

    if (query.admissionType) {
      queryBuilder.andWhere('rate.admissionType = :type', { type: query.admissionType });
    }

    queryBuilder.orderBy('rate.universityName', 'ASC');
    queryBuilder.addOrderBy('rate.competitionRate', 'DESC');

    const rates = await queryBuilder.getMany();

    // 대학별로 그룹화
    const groupedByUniversity = rates.reduce(
      (acc, rate) => {
        if (!acc[rate.universityCode]) {
          acc[rate.universityCode] = {
            universityCode: rate.universityCode,
            universityName: rate.universityName,
            items: [],
            totalRecruitment: 0,
            totalApplication: 0,
            lastCrawledAt: rate.crawledAt,
          };
        }
        acc[rate.universityCode].items.push(rate);
        acc[rate.universityCode].totalRecruitment += rate.recruitmentCount;
        acc[rate.universityCode].totalApplication += rate.applicationCount;

        if (rate.crawledAt > acc[rate.universityCode].lastCrawledAt) {
          acc[rate.universityCode].lastCrawledAt = rate.crawledAt;
        }
        return acc;
      },
      {} as Record<string, any>,
    );

    return Object.values(groupedByUniversity).map((group) => ({
      universityCode: group.universityCode,
      universityName: group.universityName,
      summary: {
        totalRecruitment: group.totalRecruitment,
        totalApplication: group.totalApplication,
        overallRate:
          group.totalRecruitment > 0
            ? Math.round((group.totalApplication / group.totalRecruitment) * 100) / 100
            : 0,
        lastCrawledAt: group.lastCrawledAt,
      },
      items: group.items.map((item) => ({
        universityName: item.universityName,
        departmentName: item.departmentName,
        admissionType: item.admissionType,
        recruitmentCount: item.recruitmentCount,
        applicationCount: item.applicationCount,
        competitionRate: Number(item.competitionRate),
      })),
    }));
  }

  /**
   * 최근 변동 내역 조회
   */
  async getRecentChanges(
    universityCode?: string,
    limit: number = 50,
  ): Promise<ApplicationRateChangeDto[]> {
    const queryBuilder = this.historyRepository.createQueryBuilder('history');

    if (universityCode) {
      queryBuilder.andWhere('history.universityCode = :code', { code: universityCode });
    }

    queryBuilder.orderBy('history.recordedAt', 'DESC');
    queryBuilder.limit(limit);

    const histories = await queryBuilder.getMany();

    return histories.map((h) => ({
      universityName: h.universityName,
      departmentName: h.departmentName,
      previousCount: h.previousApplicationCount,
      currentCount: h.applicationCount,
      changeAmount: h.changeAmount,
      previousRate: Number(h.previousCompetitionRate),
      currentRate: Number(h.competitionRate),
      recordedAt: h.recordedAt,
    }));
  }

  /**
   * 수동 크롤링 트리거
   */
  async triggerManualCrawl(
    universityCode?: string,
  ): Promise<{ message: string; crawledCount: number }> {
    let crawledCount = 0;

    for (const source of this.crawlSources) {
      if (universityCode && source.universityCode !== universityCode) continue;
      if (!source.isActive) continue;

      try {
        await this.crawlAndSave(source);
        crawledCount++;
        this.logger.log(`Manual crawl completed: ${source.universityName}`);
      } catch (error) {
        this.logger.error(`Manual crawl failed for ${source.universityName}: ${error.message}`);
      }
    }

    return {
      message: `Crawled ${crawledCount} universities`,
      crawledCount,
    };
  }

  /**
   * 크롤링 소스 목록 조회
   */
  getCrawlSources(): CrawlSource[] {
    return this.crawlSources;
  }

  /**
   * 특정 대학 상세 정보 조회
   */
  async getUniversityDetail(universityCode: string): Promise<ApplicationRateResponseDto | null> {
    const rates = await this.getApplicationRates({ universityCode });
    return rates.length > 0 ? rates[0] : null;
  }
}
