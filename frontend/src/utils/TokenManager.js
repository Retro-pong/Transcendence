import Fetch from '@/utils/Fetch';
import ErrorHandler from '@/utils/ErrorHandler';

class TokenManager {

  static #activeUser =
    localStorage.getItem('user') || 'hyobicho@student.42seoul.kr'; // 테스트용

  static setAccessToken(accessToken) {
    localStorage.setItem('accessToken', accessToken);
  }

  static getAccessToken() {
    return localStorage.getItem('accessToken');
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
    localStorage.removeItem('accessToken');
    this.removeActiveUser();
    Fetch.removeHeader('Authorization');
    Fetch.setCredentials('same-origin');
  }

  static async reissueAccessToken() {
    await Fetch.post('/login/token/refresh', {}).then((res) => {
      this.setAccessToken(res.access_token);
    }).catch((err) => {
      ErrorHandler.setToast('Invalid refresh token');
      this.logout();
    });
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
    if (!this.getAccessToken()) {
      console.log('로그인 페이지로 이동해야 함'); // 테스트용
      return;
    }
    // 테스트용
    // await Fetch.post('/login/email/login', {
    //   email: this.#activeUser,
    //   code: localStorage.getItem('code'),
    // })
    //   .then((data) => {
    //     this.storeTokens({
    //       user: data.user,
    //       accessToken: data.access_token,
    //     });
    //   })
    //   .catch((err) => {
    //     this.clearTokens();
    //     ErrorHandler.setToast(err.error || 'You need to login');
    //     console.log(err);
    //   });
    console.log(
      `activeUser: ${this.#activeUser} accessToken: ${this.getAccessToken()}`
    ); // 테스트용
    Fetch.setCredentials('include');
    await Fetch.post('/login/token/refresh', { refresh: 'test' })
      .then((data) => {
        console.log(data); // 테스트용
        this.setAccessToken(data.access_token);
      })
      .catch((err) => {
        // refresh token 만료 시 로그아웃 처리
        this.clearTokens();
        ErrorHandler.setToast(err.error || 'You need to login');
        console.error(err);
      });
  }
}

export default TokenManager;
