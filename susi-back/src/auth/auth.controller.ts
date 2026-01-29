import {
  BadGatewayException,
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  SerializeOptions,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { loginWithEmailDto } from './dtos/login-with-email.dto';
import { LoginResponseType } from './types/login-response.type';
import { Public } from './decorators/public.decorator';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { LogoutDto } from './dtos/logout.dto';
import { LoginWithSocialDto } from './dtos/login-with-social.dto';
import { SmsService } from 'src/modules/sms/sms.service';
import { SendSignupCodeDto } from './dtos/send-signup-code.dto';
import { MembersService } from 'src/modules/members/services/members.service';
import { VerifyCodeDto } from './dtos/verify-code.dto';
import { RegisterWithEmailDto } from './dtos/register-with-email.dto';
import { RegisterWithSocialDto } from './dtos/register-with-social';
import { CurrentMemberId } from './decorators/current-member_id.decorator';
import { MemberEntity } from 'src/database/entities/member/member.entity';
import { CookieService } from './services/cookie.service';
import { OAuthClientService } from './services/oauth-client.service';
import { Inject, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import { SsoExchangeDto } from './dtos/sso-exchange.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController implements OnModuleInit {
  private redis: Redis;

  constructor(
    private readonly service: AuthService,
    private readonly smsService: SmsService,
    private readonly membersService: MembersService,
    private readonly cookieService: CookieService,
    private readonly oauthClientService: OAuthClientService,
  ) {}

  onModuleInit() {
    // OAuth state 저장을 위한 Redis 클라이언트 초기화
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
      keyPrefix: 'susi-oauth:',
    });
    this.redis.on('connect', () => {
      console.log('✅ [OAuth] Redis 클라이언트 연결됨');
    });
    this.redis.on('error', (err) => {
      console.error('❌ [OAuth] Redis 연결 오류:', err.message);
    });
  }

  @ApiOperation({
    summary: '내 정보 조회',
    description: '현재 로그인한 사용자의 상세 정보를 조회합니다. JWT 토큰 인증이 필요합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '사용자 정보 조회 성공',
    type: MemberEntity,
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패 (JWT 토큰 없음 또는 유효하지 않음)',
  })
  @ApiBearerAuth('access-token')
  @SerializeOptions({
    groups: ['me'],
  })
  @Get('me')
  public getCurrentMember(@CurrentMemberId() memberId: string): Promise<MemberEntity> {
    return this.membersService.findMeById(Number(memberId));
  }

  @ApiOperation({
    summary: '활성화 중인 서비스 조회',
    description: '현재 로그인한 사용자가 구독 중인 활성화된 서비스 목록을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '활성 서비스 목록 조회 성공',
    type: [String],
    example: ['수시_교과', '정시_표준점수'],
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패 (JWT 토큰 없음 또는 유효하지 않음)',
  })
  @ApiBearerAuth('access-token')
  @SerializeOptions({
    groups: ['me'],
  })
  @Get('me/active')
  public getCurrentMemberActiveService(@CurrentMemberId() memberId: string): Promise<string[]> {
    return this.membersService.findActiveServicesById(Number(memberId));
  }

  @ApiOperation({
    summary: '이메일로 로그인',
    description:
      '이메일과 비밀번호를 사용하여 로그인합니다. 성공 시 JWT 액세스 토큰과 리프레시 토큰을 반환합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '로그인 성공',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9...',
        refreshToken: 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9...',
        tokenExpiry: 7200,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청 (이메일 형식 오류, 비밀번호 길이 오류)',
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패 (이메일 또는 비밀번호 불일치)',
  })
  @SerializeOptions({
    groups: ['me'],
  })
  @Public()
  @Post('login/email')
  public async loginWithEmail(
    @Body() loginDto: loginWithEmailDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponseType> {
    const result = await this.service.validateLogin(loginDto);

    // HttpOnly 쿠키로 토큰 설정 (XSS 공격 방지)
    this.cookieService.setAuthCookies(
      res,
      result.accessToken,
      result.refreshToken,
      result.tokenExpiry * 1000, // 초 → 밀리초 변환
      60 * 24 * 60 * 60 * 1000, // 60일 (밀리초)
    );

    return result;
  }

  @ApiOperation({
    summary: '이메일로 회원가입',
    description:
      '이메일과 비밀번호를 사용하여 새 계정을 생성합니다. 회원가입 성공 시 자동 로그인되며 JWT 토큰을 반환합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '회원가입 성공',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9...',
        refreshToken: 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9...',
        tokenExpiry: 7200,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청 (이메일 중복, 전화번호 중복, 필수 필드 누락)',
  })
  @SerializeOptions({
    groups: ['me'],
  })
  @Public()
  @Post('register/email')
  public async registerWithEmail(
    @Body() registerDto: RegisterWithEmailDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponseType> {
    const result = await this.service.registerWithEmail(registerDto);

    // HttpOnly 쿠키로 토큰 설정 (XSS 공격 방지)
    this.cookieService.setAuthCookies(
      res,
      result.accessToken,
      result.refreshToken,
      result.tokenExpiry * 1000,
      60 * 24 * 60 * 60 * 1000,
    );

    return result;
  }

  @ApiOperation({
    summary: '소셜 로그인',
    description:
      '네이버 또는 구글 소셜 로그인을 수행합니다. OAuth 제공자로부터 발급받은 액세스 토큰을 사용합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '소셜 로그인 성공',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9...',
        refreshToken: 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9...',
        tokenExpiry: 7200,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청 (소셜 타입 오류, 액세스 토큰 없음)',
  })
  @ApiResponse({
    status: 401,
    description: '소셜 인증 실패 (유효하지 않은 액세스 토큰)',
  })
  @SerializeOptions({
    groups: ['me'],
  })
  @Public()
  @Post('login/social')
  public async socialLogin(
    @Body() body: LoginWithSocialDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponseType> {
    const result = await this.service.validateSocialLogin(body);

    // HttpOnly 쿠키로 토큰 설정 (XSS 공격 방지)
    this.cookieService.setAuthCookies(
      res,
      result.accessToken,
      result.refreshToken,
      result.tokenExpiry * 1000,
      60 * 24 * 60 * 60 * 1000,
    );

    return result;
  }

  @ApiOperation({
    summary: '소셜 회원가입',
    description:
      '네이버 또는 구글 소셜 로그인으로 새 계정을 생성합니다. 추가 정보 입력이 필요합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '소셜 회원가입 성공',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9...',
        refreshToken: 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9...',
        tokenExpiry: 7200,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청 (전화번호 중복, 소셜 계정 이미 등록됨, 필수 필드 누락)',
  })
  @ApiResponse({
    status: 401,
    description: '소셜 인증 실패 (유효하지 않은 액세스 토큰)',
  })
  @SerializeOptions({
    groups: ['me'],
  })
  @Public()
  @Post('register/social')
  public async registerWithSocial(
    @Body() registerDto: RegisterWithSocialDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponseType> {
    const result = await this.service.registerWithSocial(registerDto);

    // HttpOnly 쿠키로 토큰 설정 (XSS 공격 방지)
    this.cookieService.setAuthCookies(
      res,
      result.accessToken,
      result.refreshToken,
      result.tokenExpiry * 1000,
      60 * 24 * 60 * 60 * 1000,
    );

    return result;
  }

  @ApiOperation({
    summary: 'JWT 토큰 리프레시',
    description:
      '만료된 액세스 토큰을 리프레시 토큰을 사용하여 갱신합니다. 새로운 액세스 토큰과 리프레시 토큰을 반환합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '토큰 갱신 성공',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9...',
        refreshToken: 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9...',
        tokenExpiry: 7200,
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '리프레시 토큰 유효하지 않음 또는 만료됨',
  })
  @Public()
  @Post('refresh')
  async refresh(
    @Body() refreshDto: RefreshTokenDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponseType> {
    // 쿠키 또는 요청 바디에서 리프레시 토큰 추출
    const refreshToken = this.cookieService.extractRefreshToken(req) || refreshDto.refreshToken;

    const result = await this.service.refreshToken({
      refreshToken,
    });

    // HttpOnly 쿠키로 새 토큰 설정
    this.cookieService.setAuthCookies(
      res,
      result.accessToken,
      result.refreshToken,
      result.tokenExpiry * 1000,
      60 * 24 * 60 * 60 * 1000,
    );

    return result;
  }

  @ApiOperation({
    summary: '로그아웃',
    description:
      '사용자를 로그아웃합니다. 리프레시 토큰을 블랙리스트에 추가하고 Hub SSO 세션도 정리합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '로그아웃 성공',
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패 (JWT 토큰 없음 또는 유효하지 않음)',
  })
  @Public()
  @Post('logout')
  async logout(
    @Body() logoutDto: LogoutDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    // 쿠키 또는 요청 바디에서 토큰 추출
    const accessToken = this.cookieService.extractAccessToken(req);
    const refreshToken = this.cookieService.extractRefreshToken(req) || logoutDto?.refreshToken;

    // Hub SSO 로그아웃 (액세스 토큰이 있는 경우)
    if (accessToken) {
      await this.oauthClientService.ssoLogout(accessToken);
    }

    // 로컬 로그아웃 (리프레시 토큰 블랙리스트)
    if (refreshToken) {
      await this.service.logout(refreshToken);
    }

    // 모든 인증 쿠키 삭제
    this.cookieService.clearAuthCookies(res);

    return null;
  }

  @ApiOperation({
    summary: '휴대폰 본인인증번호 발송',
    description:
      '회원가입 시 휴대폰 본인인증을 위한 6자리 인증번호를 SMS로 발송합니다. 이메일과 전화번호 중복을 체크합니다.',
  })
  @ApiQuery({
    name: 'branch',
    required: false,
    description: '지점 코드 (선택)',
    example: 'gangnam',
  })
  @ApiResponse({
    status: 200,
    description: '인증번호 발송 성공',
  })
  @ApiResponse({
    status: 400,
    description: '이미 사용 중인 이메일 또는 전화번호',
  })
  @Public()
  @Post('register/send-code')
  async sendSignupCode(@Body() body: SendSignupCodeDto, @Query('branch') branch?: string) {
    if (body.email && (await this.membersService.findOneByEmail(body.email))) {
      throw new BadRequestException('이미 사용중인 이메일입니다.');
    }
    if (await this.membersService.findOneByPhone(body.phone.replaceAll('-', ''))) {
      throw new BadRequestException('이미 사용중인 휴대폰입니다.');
    }

    await this.smsService.sendRegisterCode(body.phone, branch);

    return null;
  }

  @ApiOperation({
    summary: '인증코드 확인',
    description: 'SMS로 전송된 6자리 인증코드를 확인합니다. 회원가입 프로세스의 일부입니다.',
  })
  @ApiResponse({
    status: 200,
    description: '인증코드 확인 성공',
  })
  @ApiResponse({
    status: 502,
    description: '인증코드 불일치',
  })
  @Public()
  @Post('verify-code')
  async verifyCode(@Body() verifyDto: VerifyCodeDto) {
    const isValid = await this.smsService.verifyCode(verifyDto.phone, verifyDto.code);
    if (!isValid) {
      throw new BadGatewayException('인증코드가 일치하지 않습니다.');
    }

    return null;
  }

  @ApiOperation({
    summary: '비밀번호 재설정 인증번호 요청',
    description: '비밀번호 찾기를 위해 이메일과 전화번호를 확인하고 SMS 인증번호를 발송합니다.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          format: 'email',
          example: 'student@example.com',
        },
        phone: { type: 'string', example: '010-1234-5678' },
      },
      required: ['email', 'phone'],
    },
  })
  @ApiQuery({
    name: 'branch',
    required: false,
    description: '지점 코드 (선택)',
    example: 'gangnam',
  })
  @ApiResponse({
    status: 200,
    description: '인증번호 발송 성공',
  })
  @ApiResponse({
    status: 400,
    description: '이메일과 전화번호가 일치하지 않음',
  })
  @ApiResponse({
    status: 404,
    description: '사용자를 찾을 수 없음',
  })
  @Public()
  @Post('password-reset-request')
  async passwordResetRequest(
    @Body() body: { email: string; phone: string },
    @Query('branch') branch?: string,
  ) {
    return this.service.requestPasswordResetCode(body.email, body.phone, branch);
  }

  @ApiOperation({
    summary: '비밀번호 재설정 인증번호 확인 및 토큰 발급',
    description: 'SMS로 전송된 인증번호를 확인하고 비밀번호 재설정을 위한 임시 토큰을 발급합니다.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        phone: { type: 'string', example: '010-1234-5678' },
        code: { type: 'string', example: '123456' },
      },
      required: ['phone', 'code'],
    },
  })
  @ApiResponse({
    status: 200,
    description: '인증 성공, 비밀번호 재설정 토큰 발급',
    schema: {
      example: {
        resetToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: '인증코드 불일치',
  })
  @Public()
  @Post('verify-reset-code')
  async verifyResetCode(@Body() body: { phone: string; code: string }) {
    return this.service.verifyResetCodeAndCreateToken(body.phone, body.code);
  }

  @ApiOperation({
    summary: '비밀번호 재설정',
    description: '비밀번호 재설정 토큰을 사용하여 새 비밀번호로 변경합니다.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
        newPassword: { type: 'string', example: 'newPassword123!' },
      },
      required: ['token', 'newPassword'],
    },
  })
  @ApiResponse({
    status: 200,
    description: '비밀번호 재설정 성공',
  })
  @ApiResponse({
    status: 400,
    description: '유효하지 않거나 만료된 토큰',
  })
  @Public()
  @Post('password-reset')
  async passwordReset(@Body() body: { token: string; newPassword: string }) {
    return this.service.resetPassword(body.token, body.newPassword);
  }

  @ApiOperation({
    summary: 'Hub OAuth 로그인 시작',
    description: 'Hub 계정으로 로그인하기 위한 OAuth 인증 플로우를 시작합니다. Hub 인증 페이지로 리다이렉트됩니다.',
  })
  @ApiResponse({
    status: 302,
    description: 'Hub OAuth 인증 페이지로 리다이렉트',
  })
  @Public()
  @Get('oauth/login')
  async oauthLogin(@Res() res: Response) {
    // PKCE Challenge 생성
    const { codeVerifier, codeChallenge } = this.oauthClientService.generatePKCEChallenge();

    // CSRF 방지용 state 생성
    const state = Math.random().toString(36).substring(2, 15);

    // Code Verifier를 Redis에 직접 저장 (5분 TTL)
    const redisKey = `verifier:${state}`;
    await this.redis.setex(redisKey, 300, codeVerifier); // 300초 = 5분
    console.log(`✅ [OAuth Login] Redis에 저장: ${redisKey} = ${codeVerifier.substring(0, 20)}...`);

    // 저장 확인
    const savedValue = await this.redis.get(redisKey);
    console.log(`🔍 [OAuth Login] 저장 즉시 조회: ${savedValue ? '성공' : '실패'}`);

    // Hub 인증 페이지로 리다이렉트
    const authUrl = this.oauthClientService.getAuthorizationUrl(state, codeChallenge);
    console.log(`🔗 [OAuth Login] Redirect to: ${authUrl}`);
    res.redirect(authUrl);
  }

  @ApiOperation({
    summary: 'Hub OAuth 콜백 처리',
    description: 'Hub OAuth 인증 후 리다이렉트되는 콜백 엔드포인트입니다. Authorization Code를 받아 토큰으로 교환하고 사용자 정보를 가져옵니다.',
  })
  @ApiQuery({
    name: 'code',
    required: true,
    description: 'Authorization Code',
  })
  @ApiQuery({
    name: 'state',
    required: true,
    description: 'CSRF 방지용 State',
  })
  @ApiResponse({
    status: 200,
    description: 'OAuth 로그인 성공',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9...',
        refreshToken: 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9...',
        tokenExpiry: 7200,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청 (code 또는 state 누락)',
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패 (유효하지 않은 코드 또는 state)',
  })
  @Public()
  @Get('oauth/callback')
  async oauthCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() res: Response,
  ): Promise<void> {
    if (!code || !state) {
      throw new BadRequestException('code와 state 파라미터가 필요합니다.');
    }

    console.log(`📥 [OAuth Callback] 받은 state: ${state}`);

    // Redis에서 Code Verifier를 원자적으로 조회 및 삭제 (GETDEL)
    // 이렇게 하면 중복 요청 시 첫 번째 요청만 verifier를 얻을 수 있음
    const redisKey = `verifier:${state}`;
    const codeVerifier = await this.redis.getdel(redisKey);
    console.log(`🔍 [OAuth Callback] ${redisKey} GETDEL 결과: ${codeVerifier ? '성공' : '실패 (이미 사용됨 또는 만료)'}`);

    if (!codeVerifier) {
      throw new UnauthorizedException('유효하지 않거나 만료된 state입니다.');
    }

    // Authorization Code를 Access Token으로 교환
    const tokens = await this.oauthClientService.exchangeCodeForTokens(code, codeVerifier);

    // ID Token 검증 - ID Token에 이미 email, nickname, phone 정보가 포함되어 있음
    const idTokenPayload = this.oauthClientService.verifyIdToken(tokens.id_token);

    // Susi에 해당 사용자가 있는지 확인 (이메일 기반)
    let member = await this.membersService.findOneByEmail(idTokenPayload.email);

    if (!member) {
      // 신규 사용자인 경우 자동 회원가입 처리
      // ID Token에서 받은 정보로 계정 생성
      member = await this.membersService.createMemberFromOAuth({
        email: idTokenPayload.email,
        nickname: idTokenPayload.nickname,
        phone: idTokenPayload.phone,
        hubMemberId: idTokenPayload.sub, // Hub의 memberId 저장
      });
    }

    // Susi의 JWT 토큰 발급
    const accessToken = this.service['jwtService'].createAccessToken(member.id);
    const refreshToken = this.service['jwtService'].createRefreshToken(member.id);
    const tokenExpiry = this.service['jwtService'].getTokenExpiryTime();
    const activeServices = await this.membersService.findActiveServicesById(member.id);

    // OAuth 인증 완료 후 프론트엔드로 리다이렉트
    // 프론트엔드에서 토큰을 localStorage에 저장하도록 쿼리 파라미터로 전달
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
    const callbackUrl = new URL(`${frontendUrl}/auth/oauth/callback`);
    callbackUrl.searchParams.set('access_token', accessToken);
    callbackUrl.searchParams.set('refresh_token', refreshToken);
    callbackUrl.searchParams.set('token_expiry', tokenExpiry.toString());

    res.redirect(callbackUrl.toString());
  }

  // ==========================================
  // SSO (Single Sign-On) Backend Token Exchange
  // ==========================================

  @ApiOperation({
    summary: 'SSO 코드 교환 (Backend Token Exchange)',
    description:
      'Hub에서 받은 SSO 코드를 Hub Backend에 검증하고 토큰을 받아옵니다. 이 엔드포인트는 Susi Frontend에서 호출되며, Hub Backend와의 통신을 담당합니다.',
  })
  @ApiResponse({
    status: 200,
    description: 'SSO 코드 교환 성공 및 토큰 발급',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9...',
        refreshToken: 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9...',
        tokenExpiry: 7200,
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'SSO 코드 유효하지 않거나 만료됨',
  })
  @Public()
  @Post('sso/exchange')
  public async exchangeSsoCode(@Body() dto: SsoExchangeDto): Promise<LoginResponseType> {
    return this.service.exchangeSsoCode(dto.code);
  }
}
