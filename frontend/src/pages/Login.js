import PageComponent from '@component/PageComponent.js';
import RegisterFormItem from '@component/form/RegisterFormItem';
import Header from '@component/text/Header';
import LoginPageButtons from '@component/button/LoginPageButtons';
import ModalComponent from '@component/modal/ModalComponent';
import LoginForm from '@component/form/LoginForm';
import { Modal } from 'bootstrap';
import Regex from '@/constants/Regex';
import Fetch from '@/utils/Fetch';
import Router from '@/utils/Router';
import TokenManager from '@/utils/TokenManager';
import ToastHandler from '@/utils/ToastHandler';
import { navigateTo, router } from '../utils/router';

class Login extends PageComponent {
  constructor() {
    super();
    this.setTitle('Login');
    this.email = '';
    this.code = new URLSearchParams(window.location.search).get('code');
  }

  async render() {
    const LoginHeader = Header({
      title: 'PONG!',
      subtitle: "- The World's best retro pong game",
    });
    const LoginModal = ModalComponent({
      borderColor: 'mint',
      title: 'WAIT!',
      modalId: 'loginModal',
      content: LoginForm(),
      buttonList: ['submitBtn'],
    });

    return `
      ${LoginHeader}
      <div class="d-flex justify-content-center align-items-center h-85">
        <div class="d-flex flex-column justify-content-around align-items-center h-100 py-3">
          <div>
            ${RegisterFormItem('row py-3', 'email-login', 'EMAIL', 'text', 'name @ mail')}
            ${RegisterFormItem('row py-3', 'password-login', 'PASSWORD', 'password', 'PASSWORD')}
          </div>
          <div>
            ${LoginPageButtons()}
          </div>
        </div>
          ${LoginModal}
      </div>
      `;
  }

  async get2FACode(loginModal) {
    const email = document.getElementById('email-login').value;
    const password = document.getElementById('password-login').value;

    if (!email || !password) {
      ToastHandler.setToast('Please enter your email and password');
      return;
    }
    if (Regex.email.test(email) === false) {
      ToastHandler.setToast('Invalid Email Address');
      return;
    }
    await Fetch.post('/login/email/login/', { email, password })
      .then(() => {
        loginModal.show();
      })
      .catch((err) => {
        ToastHandler.setToast(err.error || 'Login Failed');
      });
  }

  async getAccessToken(loginModal) {
    const email = document.getElementById('email-login').value;
    const passcode = document.getElementById('passcode').value;

    if (!passcode) {
      ToastHandler.setToast('Please enter your passcode');
      return;
    }
    if (Regex.passcode.test(passcode) === false) {
      ToastHandler.setToast('Invalid Passcode');
      return;
    }

    await Fetch.post('/login/email/login/verify/', { email, code: passcode })
      .then((data) => {
        TokenManager.storeToken(data.access_token);
        loginModal.hide();
        Router.navigateTo('/');
      })
      .catch((err) => {
        ToastHandler.setToast(err.error || 'Verification Failed');
      });
  }

  handle2FALogin() {
    const loginModalBtn = document.getElementById('loginBtn');
    const twoFactorLoginBtn = document.getElementById('twoFactorLoginBtn');
    const loginModal = new Modal('#loginModal');

    loginModalBtn.addEventListener('click', async () => {
      await this.get2FACode(loginModal);
      twoFactorLoginBtn.addEventListener('click', async () => {
        await this.getAccessToken(loginModal);
      });
    });
  }

  // TODO: 서버 응답 에러 분기 처리
  submitRegisterForm() {
    document
      .getElementById('registerForm')
      .addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target.elements;
        const email = form.email.value;
        const username = form.nick.value;
        const password = form.password.value;
        const passwordRe = form.passwordRe.value;
        if (!email || !username || !password || !passwordRe) {
          ToastHandler.setToast('Please fill in all fields');
          return;
        }
        if (Regex.email.test(email) === false) {
          ToastHandler.setToast('Invalid Email Address');
          return;
        }
        if (Regex.nickname.test(username) === false) {
          ToastHandler.setToast('Nickname must be 2-10 characters');
          return;
        }

        if (password.length < 8) {
          ToastHandler.setToast('Password must be at least 8 characters');
          return;
        }
        if (password.search(/[a-zA-Z]/) === -1) {
          ToastHandler.setToast('Password must contain at least one letter');
          return;
        }
        if (password.search(/[0-9]/) === -1) {
          ToastHandler.setToast('Password must contain at least one number');
          return;
        }

        if (password !== passwordRe) {
          ToastHandler.setToast('Password does not match');
          return;
        }

        const registerModal = Modal.getOrCreateInstance('#registerModal');
        const verifyModal = Modal.getOrCreateInstance('#emailVerifyModal');

        await Fetch.post('/login/email/register/', {
          email,
          username: username.toLowerCase(),
          password,
        })
          .then(() => {
            this.email = email;
            ToastHandler.setToast('Registration Successful');
            document.getElementById('registerForm').reset();
            registerModal.hide();
            verifyModal.show();
          })
          .catch((err) => {
            this.email = '';
            ToastHandler.setToast(err.error || 'Registration Failed');
          });
      });
  }

  submitEmailVerifyForm() {
    document
      .getElementById('emailVerifyForm')
      .addEventListener('submit', async (e) => {
        e.preventDefault();
        const { email } = this;
        const code = document.getElementById('emailCode').value;

        const verifyModal = Modal.getOrCreateInstance('#emailVerifyModal');
        await Fetch.post('/login/email/register/verify/', { email, code })
          .then(() => {
            ToastHandler.setToast('Email Verification Successful');
            document.getElementById('emailVerifyForm').reset();
            verifyModal.hide();
            this.email = '';
          })
          .catch((err) => {
            ToastHandler.setToast(err.error || 'Verification Failed');
          });
      });
  }

  async handle42Login() {
    // TODO: 로딩 처리
    await Fetch.get(`/login/intra/callback/?code=${this.code}`)
      .then((data) => {
        TokenManager.storeToken(data.access_token);
        Router.navigateTo('/');
      })
      .catch(() => {
        ToastHandler.setToast('42 Login Failed');
        TokenManager.clearToken();
        Router.navigateTo('/login');
      });
  }

  async afterRender() {
    // 42 로그인
    if (this.code) {
      console.log('42 login code:', this.code);
      await this.handle42Login();
      return;
    }
    // 2FA 로그인
    this.handle2FALogin();
    // 회원가입
    this.submitRegisterForm();
    this.submitEmailVerifyForm();
  }
}

export default Login;
