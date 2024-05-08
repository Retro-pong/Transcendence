import Fetch from '@/utils/Fetch';
import { navigateTo } from '@/utils/router';

class TokenManager {
  static #accessToken = null;

  static #refreshToken = this.#initRefreshToken();

  static #refreshExpiresIn = 60 * 60;

  static setAccessToken(accessToken) {
    this.#accessToken = accessToken;
  }

  static getAccessToken() {
    return this.#accessToken;
  }

  static setRefreshToken(refreshToken) {
    console.log('setRefreshToken');
    this.#refreshToken = refreshToken;
    document.cookie = `refreshToken=${refreshToken}; max-age=${this.#refreshExpiresIn}`;
  }

  static #initRefreshToken() {
    console.log('initRefreshToken');
    const cookies = document.cookie.split(';');
    // eslint-disable-next-line no-restricted-syntax
    for (const cookie of cookies) {
      const [key, value] = cookie.split('=');
      if (key === 'refreshToken') {
        return value;
      }
    }
    return null;
  }

  static getRefreshToken() {
    return this.#refreshToken;
  }

  static storeTokens({ user, accessToken, refreshToken }) {
    this.setAccessToken(accessToken);
    this.setRefreshToken(refreshToken);
    localStorage.setItem('user', user);
    Fetch.setHeader('Authorization', `Bearer ${accessToken}`);
    Fetch.setCredentials('include');
  }

  static clearTokens() {
    this.#accessToken = null;
    this.#refreshToken = null;
    localStorage.clear();
    document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
    Fetch.removeHeader('Authorization');
    Fetch.setCredentials('omit');
  }

  static async authenticateUser() {
    if (!this.#refreshToken) {
      return;
    }
    // 테스트용 mock api 요청 (실제 요청 바디엔 refresh token 보냄)
    await Fetch.post('/login', {
      email: localStorage.getItem('user'),
      password: '123123',
    })
      .then((data) => {
        this.storeTokens({
          user: data.user.email,
          accessToken: data.accessToken,
          refreshToken: data.accessToken,
        });
      })
      .catch((err) => {
        // refresh token 만료 시 로그아웃 처리
        this.clearTokens();
        console.error(err);
      });
  }
}

export default TokenManager;
