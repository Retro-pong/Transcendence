import Fetch from '@/utils/Fetch';
import ErrorHandler from '@/utils/ErrorHandler';

class TokenManager {
  static setAccessToken(accessToken) {
    localStorage.setItem('accessToken', accessToken);
  }

  static getAccessToken() {
    return localStorage.getItem('accessToken');
  }

  static deleteAccessToken() {
    localStorage.removeItem('accessToken');
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
    await Fetch.post('/login/token/refresh')
      .then((res) => {
        this.storeToken(res.access_token);
      })
      .catch((err) => {
        ErrorHandler.setToast('You need to login');
        // this.clearToken();
        console.error(err);
      });
  }

  static async logout() {
    await Fetch.post('/login/logout')
      .then(() => {
        this.clearToken();
      })
      .catch(() => {
        ErrorHandler.setToast('Logout Failed');
        // this.clearToken(); // 테스트용
      });
  }

  // TODO: 페이지 이동 시 유저 정보 받아오는 요청으로 수정
  static async authenticateUser() {
    // await this.reissueAccessToken();
  }
}

export default TokenManager;
