import Fetch from '@/utils/Fetch';

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
}

export default TokenManager;
