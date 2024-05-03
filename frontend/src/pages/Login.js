import PageComponent from '@component/PageComponent.js';
import RegisterFormItem from '@component/form/RegisterFormItem.js';
import Header from '@component/text/Header';
import LoginPageButtons from '@component/button/LoginPageButtons';

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
      </div>
      `;
  }

  async afterRender() {
    // TODO: login api 요청 & 에러 처리
    document.getElementById('loginBtn').addEventListener('click', async () => {
      const email = document.getElementById('email-login').value;
      const password = document.getElementById('password-login').value;
      if (!email || !password) return;
      console.log(`email login`);
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
