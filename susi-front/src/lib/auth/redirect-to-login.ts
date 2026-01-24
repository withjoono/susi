/**
 * Hub OAuth 로그인 리다이렉트
 *
 * 인증이 필요할 때 Hub SSO 로그인 페이지로 바로 리다이렉트합니다.
 * 로그인 페이지를 거치지 않고 바로 Hub OAuth 인증을 시작합니다.
 */

import { env } from '../config/env';

/**
 * Hub OAuth 로그인 URL 생성
 * 개발/프로덕션 환경에 따라 적절한 URL 반환
 */
export const getHubOAuthLoginUrl = (): string => {
  // 개발 환경: localhost:4001 직접 호출 (Vite 프록시 우회 필요)
  // 프로덕션 환경: 실제 백엔드 URL 사용
  if (env.isDevelopment) {
    return 'http://localhost:4001/auth/oauth/login';
  }

  // 프로덕션 환경에서는 상대 경로 사용 (같은 도메인일 경우)
  // 또는 환경 변수에서 백엔드 URL을 가져옴
  const backendUrl = import.meta.env.VITE_API_URL_SUSI || '';
  if (backendUrl) {
    return `${backendUrl}/auth/oauth/login`;
  }

  // 기본값: 상대 경로 (Nginx 등에서 프록시 설정 필요)
  return '/api-susi/auth/oauth/login';
};

/**
 * Hub OAuth 로그인으로 리다이렉트
 *
 * 인증이 필요한 모든 경우에 이 함수를 호출합니다.
 * - 401 Unauthorized 에러 발생 시
 * - 로그인 페이지 접근 시
 * - 인증이 필요한 페이지에 비로그인 상태로 접근 시
 */
export const redirectToHubLogin = (): void => {
  // 이미 OAuth 관련 페이지에 있으면 리다이렉트하지 않음 (무한 루프 방지)
  if (window.location.pathname.includes('/auth/oauth/callback')) {
    return;
  }

  window.location.href = getHubOAuthLoginUrl();
};
