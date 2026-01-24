/**
 * 토큰 갱신 인터셉터
 * Reference 프로젝트의 단순화된 토큰 갱신 패턴 적용
 */

import { AxiosError } from 'axios';
import { camelizeKeys } from 'humps';
import { publicClient } from '../instances';
import {
  clearTokens,
  getRefreshToken,
  setAccessToken,
} from '../token-manager';
import { ERROR_CODES } from '../../errors/error-codes';
import { redirectToHubLogin } from '../../auth/redirect-to-login';

/**
 * 토큰 갱신 API 호출
 */
const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      return null;
    }

    const response = await publicClient.get('/auth/refresh', {
      headers: {
        refreshToken: `Bearer ${refreshToken}`,
      },
    });

    const { accessToken } = response.data;
    if (accessToken) {
      setAccessToken(accessToken.accessToken);
      return accessToken.accessToken;
    }

    return null;
  } catch (error) {
    console.error('토큰 갱신 실패:', error);
    return null;
  }
};

/**
 * 로그아웃 처리 (토큰 제거 + Hub OAuth 로그인으로 리다이렉트)
 */
const handleLogout = () => {
  // OAuth 콜백 페이지에서는 처리하지 않음 (무한 루프 방지)
  if (window.location.pathname.includes('/auth/oauth/callback')) {
    return;
  }

  clearTokens();
  // Hub OAuth 로그인으로 바로 리다이렉트 (별도 로그인 페이지 없음)
  redirectToHubLogin();
};

/**
 * 에러 Response 인터셉터 (토큰 갱신 포함)
 * Reference 프로젝트의 에러 처리 패턴 적용
 */
export const authResponseErrorInterceptor = async (error: AxiosError) => {
  const originalRequest = error.config as any;

  // 에러 응답 데이터를 camelCase로 변환
  if (error.response?.data) {
    error.response.data = camelizeKeys(error.response.data);
  }

  // 401 에러 처리
  if (error.response?.status === 401) {
    const errorData = error.response.data as any;
    const errorCode = errorData?.detailCode;

    // C401: 토큰 만료 → 갱신 시도
    if (errorCode === ERROR_CODES.TOKEN_EXPIRED && !originalRequest._retry) {
      originalRequest._retry = true;

      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        // 새 토큰으로 원래 요청 재시도
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return publicClient.request(originalRequest);
      } else {
        // 갱신 실패 → 로그아웃
        handleLogout();
        return Promise.reject(error);
      }
    }

    // C999: 유효하지 않은 토큰 → 로그아웃
    if (errorCode === ERROR_CODES.INVALID_TOKEN) {
      handleLogout();
      return Promise.reject(error);
    }

    // C5050: 세션 만료 → 로그아웃
    if (errorCode === ERROR_CODES.SESSION_EXPIRED) {
      alert(errorData?.message || '세션이 만료되었습니다.');
      handleLogout();
      return Promise.reject(error);
    }
  }

  return Promise.reject(error);
};
