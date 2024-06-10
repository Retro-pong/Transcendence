import Fetch from '@/utils/Fetch';
import ToastHandler from '@/utils/ToastHandler';
import Router from '@/utils/Router';

class TokenManager {
  static #accessToken = null;

  static setAccessToken(accessToken) {
    this.#accessToken = accessToken;
    localStorage.setItem('login', 'true');
  }

  static getAccessToken() {
    return this.#accessToken;
  }

  static deleteAccessToken() {
    this.#accessToken = null;
    localStorage.removeItem('login');
  }

  static getLoginStatus() {
    return !!localStorage.getItem('login');
  }

  static storeToken(accessToken) {
    this.setAccessToken(accessToken);
    SocketManager.setOnline();
    Fetch.init();
  }

  static clearToken() {
    this.deleteAccessToken();
    SocketManager.setOffline();
    Fetch.init();
  }

  static async reissueAccessToken() {
    await Fetch.post('/login/token/refresh/')
      .then((res) => {
        this.storeToken(res.access_token);
      })
      .catch((err) => {
        if (err.error !== 'No refresh token.') {
          ToastHandler.setToast('You need to login');
        }
        this.clearToken();
        Router.navigateTo('/login');
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
