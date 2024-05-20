import PageComponent from '@component/PageComponent.js';
import RegisterFormItem from '@component/form/RegisterFormItem';
import Header from '@component/text/Header';
import LoginPageButtons from '@component/button/LoginPageButtons';
import ModalComponent from '@component/modal/ModalComponent';
import LoginForm from '@component/form/LoginForm';
import { Modal } from 'bootstrap';
import Regex from '@/constants/Regex';
import Fetch from '@/utils/Fetch';
import { navigateTo } from '@/utils/router';
import TokenManager from '@/utils/TokenManager';
import ErrorHandler from '@/utils/ErrorHandler';

class Login extends PageComponent {
  constructor() {
    super();
    this.setTitle('Login');
    this.email = '';
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
      <div class="container text-center">
        ${LoginHeader}
        <div class="p-5">
          ${RegisterFormItem('row my-5 mx-2', 'email-login', 'EMAIL', 'text', 'name @ mail')}
          ${RegisterFormItem('row mx-2', 'password-login', 'PASSWORD', 'password', 'PASSWORD')}
        </div>
        <div class="p-5">
          ${LoginPageButtons()}
        </div>
          ${LoginModal}
      </div>
      `;
  }

  async get2FACode(loginModal) {
    const email = document.getElementById('email-login').value;
    const password = document.getElementById('password-login').value;

    if (!email || !password) {
      ErrorHandler.setToast('Please enter your email and password');
      return;
    }
    if (Regex.email.test(email) === false) {
      ErrorHandler.setToast('Invalid Email Address');
      return;
    }
    await Fetch.post('/login/email/login/', { email, password })
      .then(() => {
        loginModal.show();
      })
      .catch((err) => {
        ErrorHandler.setToast(err.error || 'Login Failed');
      });
  }

  async getAccessToken(loginModal) {
    const email = document.getElementById('email-login').value;
    const passcode = document.getElementById('passcode').value;

    if (!passcode) {
      ErrorHandler.setToast('Please enter your passcode');
      return;
    }
    if (Regex.passcode.test(passcode) === false) {
      ErrorHandler.setToast('Invalid Passcode');
      return;
    }

    await Fetch.post('/login/email/login/verify/', { email, code: passcode })
      .then((data) => {
        TokenManager.storeToken(data.access_token);
        loginModal.hide();
        navigateTo('/');
      })
      .catch((err) => {
        ErrorHandler.setToast(err.error || 'Verification Failed');
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
          ErrorHandler.setToast('Please fill in all fields');
          return;
        }
        if (Regex.email.test(email) === false) {
          ErrorHandler.setToast('Invalid Email Address');
          return;
        }
        if (Regex.nickname.test(username) === false) {
          ErrorHandler.setToast('Nickname must be 2-10 characters');
          return;
        }

        if (password.length < 8) {
          ErrorHandler.setToast('Password must be at least 8 characters');
          return;
        }
        if (password.search(/[a-zA-Z]/) === -1) {
          ErrorHandler.setToast('Password must contain at least one letter');
          return;
        }
        if (password.search(/[0-9]/) === -1) {
          ErrorHandler.setToast('Password must contain at least one number');
          return;
        }

        if (password !== passwordRe) {
          ErrorHandler.setToast('Password does not match');
          return;
        }

        const registerModal = Modal.getOrCreateInstance('#registerModal');
        const verifyModal = Modal.getOrCreateInstance('#emailVerifyModal');

        await Fetch.post('/login/email/register/', {
          email,
          username,
          password,
        })
          .then(() => {
            this.email = email;
            ErrorHandler.setToast('Registration Successful');
            document.getElementById('registerForm').reset();
            registerModal.hide();
            verifyModal.show();
          })
          .catch((err) => {
            this.email = '';
            ErrorHandler.setToast(err.error || 'Registration Failed');
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
            ErrorHandler.setToast('Email Verification Successful');
            document.getElementById('emailVerifyForm').reset();
            verifyModal.hide();
            this.email = '';
          })
          .catch((err) => {
            ErrorHandler.setToast(err.error || 'Verification Failed');
          });
      });
  }

  async handle42Login(code = '') {
    // TODO: 로딩 처리
    await Fetch.get(`/login/intra/callback?code=${code}`)
      .then((data) => {
        TokenManager.storeToken(data.access_token);
      })
      .catch((err) => {
        console.error(err);
        ErrorHandler.setToast('42 Login Failed');
        TokenManager.clearToken();
        history.replaceState(null, null, '/login');
      });
  }

  async afterRender() {
    // 42 로그인
    const code = new URLSearchParams(window.location.search).get('code');
    if (code) {
      await this.handle42Login(code);
    }
    // 2FA 로그인
    this.handle2FALogin();
    // 회원가입
    this.submitRegisterForm();
    this.submitEmailVerifyForm();
  }
}

export default Login;
