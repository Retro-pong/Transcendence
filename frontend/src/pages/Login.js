import PageComponent from '@component/PageComponent.js';
import RegisterForm from '@component/form/RegisterForm.js';
import OpenModalButton from '@component/button/OpenModalButton.js';
import ModalComponent from '@component/modal/ModalComponent.js';
import RegisterFormItem from '@component/form/RegisterFormItem.js';
import Header from '@component/text/Header';

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
    const RegisterBtn = OpenModalButton({
      text: '> Register <',
      classList: 'btn btn-no-outline-hover fs-8',
      modalId: '#registerModal',
    });
    console.log(RegisterBtn);
    const RegisterModal = ModalComponent({
      title: 'WELCOME!',
      modalId: 'registerModal',
      content: RegisterForm(),
      buttonList: ['confirmBtn'],
    });
    return `
     <div class="container text-center">
        ${LoginHeader}
        <div class="p-5">
          ${RegisterFormItem('row my-5 mx-2', 'email-login', 'EMAIL', 'text', 'name @ mail')}
          ${RegisterFormItem('row mx-2', 'password-login', 'PASSWORD', 'password', 'PASSWORD')}
        </div>
        <div class="row justify-content-md-center">
          <div class="col-md-auto">
            login
          <div>
        </div>
        <div class="row justify-content-md-center">
          <div class="col-md-auto">
            42 login
          <div>
        </div>
        <div class="row justify-content-md-center">
          <div class="col-md-auto">
            ${RegisterBtn}
            ${RegisterModal}
          <div>
        </div>
     </div>
      `;
  }
}

export default Login;
