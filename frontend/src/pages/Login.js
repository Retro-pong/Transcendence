import PageComponent from '@component/PageComponent.js';
import RegisterFormItem from '@component/form/RegisterFormItem';
import Header from '@component/text/Header';
import LoginPageButtons from '@component/button/LoginPageButtons';
import ToastComponent from '@component/toast/ToastComponent';
import ModalComponent from '@component/modal/ModalComponent';
import LoginForm from '@component/form/LoginForm';
import { Toast, Modal } from 'bootstrap';
import Regex from '@/constants/Regex';
import Fetch from '@/utils/Fetch';
import { navigateTo } from '@/utils/router';
import TokenManager from '@/utils/TokenManager';

class Login extends PageComponent {
  constructor() {
    super();
    this.setTitle('Login');
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
          ${ToastComponent({ id: 'login-toast', message: 'Please enter your email and password' })}
          ${LoginModal}
      </div>
      `;
  }

  async loginCheck(loginModal) {
    const email = document.getElementById('email-login').value;
    const password = document.getElementById('password-login').value;
    const loginToastMessageEl = document.getElementById('login-toast-message');
    const loginToast = Toast.getOrCreateInstance('#login-toast');

    if (!email || !password) {
      loginToastMessageEl.innerText = 'Please enter your email and password';
      loginToast.show();
      return;
    }
    if (Regex.email.test(email) === false) {
      loginToastMessageEl.innerText = 'Invalid Email Address';
      loginToast.show();
      return;
    }
    await Fetch.post('/login', { email, password })
      .then(() => {
        loginModal.show();
      })
      .catch((err) => {
        document.getElementById('login-toast-message').innerText =
          'Login Failed';
        loginToast.show();
        console.error(err);
      });
  }

  async getAccessToken(loginModal) {
    const email = document.getElementById('email-login').value;
    const passcode = document.getElementById('passcode').value;
    const loginToast = Toast.getOrCreateInstance('#login-toast');
    const loginToastMessageEl = document.getElementById('login-toast-message');

    if (Regex.passcode.test(passcode) === false) {
      loginToastMessageEl.innerText = passcode
        ? 'Invalid Passcode'
        : 'Please enter your passcode';
      loginToast.show();
      return;
    }

    // TODO: timeout 에러 처리 필요
    await Fetch.post('/login', { email, password: passcode })
      .then((data) => {
        TokenManager.storeTokens({
          user: data.user.email,
          accessToken: data.accessToken,
          refreshToken: data.accessToken,
        });
        loginModal.hide();
        navigateTo('/');
      })
      .catch((err) => {
        loginToastMessageEl.innerText = 'Invalid Passcode';
        loginToast.show();
        console.error(err);
      });
  }

  async handle2FALogin() {
    const loginModalBtn = document.getElementById('loginBtn');
    const twoFactorLoginBtn = document.getElementById('twoFactorLoginBtn');
    const loginModal = new Modal('#loginModal');

    loginModalBtn.addEventListener('click', async () => {
      await this.loginCheck(loginModal);
      twoFactorLoginBtn.addEventListener('click', async () => {
        await this.getAccessToken(loginModal);
      });
    });
  }

  // TODO: 서버 응답 에러 분기 처리
  async submitRegisterForm(form) {
    const email = form.email.value;
    const nick = form.nick.value;
    const password = form.password.value;
    const passwordRe = form.passwordRe.value;
    const registerToastMessageEl = document.getElementById(
      'login-toast-message'
    );
    const registerToast = Toast.getOrCreateInstance('#login-toast');

    if (!email || !nick || !password || !passwordRe) {
      registerToastMessageEl.innerText = 'Please fill in all fields';
      registerToast.show();
      return;
    }
    if (Regex.email.test(email) === false) {
      registerToastMessageEl.innerText = 'Invalid Email Address';
      registerToast.show();
      return;
    }
    if (Regex.nickname.test(nick) === false) {
      registerToastMessageEl.innerText = 'Nickname must be 2-10 characters';
      registerToast.show();
      return;
    }

    if (password.length < 8) {
      registerToastMessageEl.innerText =
        'Password must be at least 8 characters';
      registerToast.show();
      return;
    }
    if (password.search(/[a-zA-Z]/) === -1) {
      registerToastMessageEl.innerText =
        'Password must contain at least one letter';
      registerToast.show();
      return;
    }
    if (password.search(/[0-9]/) === -1) {
      registerToastMessageEl.innerText =
        'Password must contain at least one number';
      registerToast.show();
      return;
    }

    if (password !== passwordRe) {
      registerToastMessageEl.innerText = 'Password does not match';
      registerToast.show();
      return;
    }

    const registerModal = Modal.getOrCreateInstance('#registerModal');
    await Fetch.post('/register', { email, nick, password })
      .then(() => {
        registerToastMessageEl.innerText = 'Registration Successful';
        registerToast.show();
        registerModal.hide();
        document.getElementById('registerForm').reset();
      })
      .catch((err) => {
        registerToastMessageEl.innerText = 'Registration Failed';
        registerToast.show();
        console.error(err);
      });
  }

  async afterRender() {
    await this.handle2FALogin();
    // TODO: 42 login api 요청 & 에러 처리
    document
      .getElementById('42LoginBtn')
      .addEventListener('click', async () => {
        console.log(`42 login`);
      });
    // register form submit event
    document
      .getElementById('registerForm')
      .addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.submitRegisterForm(e.target.elements);
      });
  }
}

export default Login;
