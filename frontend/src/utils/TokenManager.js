import Fetch from '@/utils/Fetch';
import ErrorHandler from '@/utils/ErrorHandler';

class TokenManager {
  static #accessToken = null;

  static #activeUser = localStorage.getItem('user') || null;

  static setAccessToken(accessToken) {
    this.#accessToken = accessToken;
  }

  static getAccessToken() {
    return this.#accessToken;
  }

  static getActiveUser() {
    return this.#activeUser;
  }

  static setActiveUser(user) {
    if (this.#activeUser) return;
    localStorage.setItem('user', user);
    this.#activeUser = user;
  }

  static removeActiveUser() {
    this.#activeUser = null;
    localStorage.clear();
  }

  static storeTokens({ user, accessToken }) {
    this.setAccessToken(accessToken);
    this.setActiveUser(user);
    Fetch.setHeader('Authorization', `Bearer ${accessToken}`);
    Fetch.setCredentials('include');
  }

  static clearTokens() {
    this.#accessToken = null;
    this.removeActiveUser();
    Fetch.removeHeader('Authorization');
    Fetch.setCredentials('omit');
  }

  static async logout() {
    // 로그아웃 테스트용 이메일
    const email = 'hyobicho@student.42seoul.kr';
    await Fetch.post('/login/logout', {
      email: this.#activeUser || email,
    })
      .then(() => {
        this.clearTokens();
      })
      .catch((err) => {
        ErrorHandler.setToast(err.error || 'Logout Failed');
        console.error(err);
      });
  }

  static async authenticateUser() {
    if (!this.#activeUser) {
      return;
    }
    // 테스트용
    await Fetch.post('/login/email/login', {
      email: this.#activeUser,
      code: localStorage.getItem('code'),
    })
      .then((data) => {
        this.storeTokens({
          user: data.user,
          accessToken: data.access_token,
        });
      })
      .catch((err) => {
        this.clearTokens();
        ErrorHandler.setToast(err.error || 'You need to login');
        console.log(err);
      });
    // await Fetch.post('/login/token/refresh')
    //   .then((data) => {
    //     console.log(data); // 테스트용
    //     this.#accessToken = data.access_token;
    //   })
    //   .catch((err) => {
    //     // refresh token 만료 시 로그아웃 처리
    //     this.clearTokens();
    //     ErrorHandler.setToast(err.error || 'You need to login');
    //     console.error(err);
    //   });
  }
}

export default TokenManager;
