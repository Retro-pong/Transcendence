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
  const Login42Btn = BasicButton({
    id: '42LoginBtn',
    text: '> 42 Login <',
    classList: 'btn btn-no-outline-hover fs-8',
  });
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
            <div class="col-md-auto">
              ${btn}
            </div>
          </div>
        `
  ).join('');
};

export default LoginPageButtons;
