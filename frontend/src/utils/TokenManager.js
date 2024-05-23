import Fetch from '@/utils/Fetch';
import ErrorHandler from '@/utils/ErrorHandler';

class TokenManager {
  static #accessToken = null;

  static setAccessToken(accessToken) {
    this.#accessToken = accessToken;
    // localStorage.setItem('accessToken', accessToken);
  }

  static getAccessToken() {
    return this.#accessToken;
    // return localStorage.getItem('accessToken');
  }

  static deleteAccessToken() {
    this.#accessToken = null;
    // localStorage.removeItem('accessToken');
  }

  static getLoginStatus() {
    return !!this.getAccessToken();
  }

  static storeToken(accessToken) {
    this.setAccessToken(accessToken);
    Fetch.init();
  }

  static clearToken() {
    this.deleteAccessToken();
    Fetch.init();
  }

  static async reissueAccessToken() {
    await Fetch.post('/login/token/refresh/')
      .then((res) => {
        this.storeToken(res.access_token);
      })
      .catch((err) => {
        if (err.error !== 'No refresh token.') {
          ErrorHandler.setToast('You need to login');
        }
        this.clearToken();
      });
  }

  static async logout() {
    await Fetch.post('/login/logout/')
      .then(() => {
        this.clearToken();
      })
      .catch(() => {
        this.clearToken();
      });
  }
}

export default TokenManager;
