import OpenModalButton from '@component/button/OpenModalButton';
import ModalComponent from '@component/modal/ModalComponent';
import RegisterForm from '@component/form/RegisterForm';
import EmailCodeForm from '@component/form/EmailCodeForm';

const LoginPageButtons = () => {
  const Login42Btn = `<a id='42LoginBtn' href="${import.meta.env.VITE_BASE_URL}/login/intra/login/" class="btn btn-no-outline-hover fs-7">> 42 Login <</a>`;
  const RegisterBtn = OpenModalButton({
    text: '> Register <',
    classList: 'btn btn-no-outline-hover fs-7',
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
