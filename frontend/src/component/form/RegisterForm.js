import BasicButton from '@component/button/BasicButton';
import RegisterFormItem from './RegisterFormItem.js';

const RegisterForm = () => {
  return `
    <form id="registerForm" class="form">
      <div class="container">
        ${RegisterFormItem('row my-5 mx-3', 'email', 'EMAIL', 'text', 'email')}
        ${RegisterFormItem('row mb-5 mx-3', 'nick', 'NICK', 'text', 'nickname')}
        ${RegisterFormItem('row mb-5 mx-3', 'password', 'PASS', 'password', 'PASSWORD')}
        ${RegisterFormItem('row mb-5 mx-3', 'passwordRe', 'PASS(re)', 'password', 'PASSWORD')}
        ${RegisterFormItem('row mb-5 mx-3', 'emailCode', 'MAILCODE', 'text', 'MAILCODE')}
        ${BasicButton({ id: 'mailVerifyBtn', text: 'mail' })}
      </div>
    </form>
  `;
};

export default RegisterForm;
