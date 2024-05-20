import BasicButton from '@component/button/BasicButton';
import OpenModalButton from '@component/button/OpenModalButton';
import ModalComponent from '@component/modal/ModalComponent';
import RegisterForm from '@component/form/RegisterForm';
import EmailCodeForm from '@component/form/EmailCodeForm';

const LoginPageButtons = () => {
  const LoginBtn = BasicButton({
    id: 'loginBtn',
    text: '> Login <',
    classList: 'btn btn-no-outline-hover fs-8',
  });
  const Login42Btn = `<a id='42LoginBtn' href="http://localhost:80/api/v1/login/intra/login/" class="btn btn-no-outline-hover fs-8">> 42 Login <</a>`;
  const RegisterBtn = OpenModalButton({
    text: '> Register <',
    classList: 'btn btn-no-outline-hover fs-8',
    modalId: '#registerModal',
  });
  const RegisterModal = ModalComponent({
    borderColor: 'mint',
    title: 'WELCOME!',
    modalId: 'registerModal',
    content: RegisterForm(),
    buttonList: ['registerBtn'],
  });
  const EmailVerifyModal = ModalComponent({
    borderColor: 'pink',
    title: 'MAIL CODE',
    modalId: 'emailVerifyModal',
    content: EmailCodeForm(),
    buttonList: ['emailVerifyBtn'],
  });

  const BtnList = [
    LoginBtn,
    Login42Btn,
    `${RegisterBtn} ${RegisterModal} ${EmailVerifyModal}`,
  ];
  return BtnList.map(
    (btn) => `
        <div class="row justify-content-md-center">
            <div class="col-md-auto text-center">
              ${btn}
            </div>
          </div>
        `
  ).join('');
};

export default LoginPageButtons;
