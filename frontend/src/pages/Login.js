import PageComponent from '@component/PageComponent.js';
import RegisterFormItem from '@component/form/RegisterFormItem.js';
import Header from '@component/text/Header';
import LoginPageButtons from '@component/button/LoginPageButtons';
import ToastComponent from '@component/toast/ToastComponent';
import { Toast } from 'bootstrap';
import Regex from '@/constants/Regex';

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
          ${ToastComponent({ id: 'login-toast', message: 'please enter your email and password' })}
      </div>
      `;
  }

  async getAccessToken({ email, password }) {
    console.log(email, password);
    await fetch('http://localhost:8080/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  async afterRender() {
    const loginToastEl = document.getElementById('login-toast');
    const loginToastMessageEl = document.getElementById('login-toast-message');
    const loginToast = Toast.getOrCreateInstance(loginToastEl);

    // TODO: login api 요청 & 에러 처리
    document.getElementById('loginBtn').addEventListener('click', async () => {
      const email = document.getElementById('email-login').value;
      const password = document.getElementById('password-login').value;
      if (!email || !password) {
        loginToast.show();
        return;
      }
      if (Regex.email.test(email) === false) {
        loginToastMessageEl.innerText = 'Invalid Email Address';
        loginToast.show();
        return;
      }
      await this.getAccessToken({ email, password });
    });

    // TODO: 42 login api 요청 & 에러 처리
    document
      .getElementById('42LoginBtn')
      .addEventListener('click', async () => {
        console.log(`42 login`);
      });
  }
}

export default Login;
