import RegisterFormItem from './RegisterFormItem.js';

const RegisterForm = () => {
  return `
    <form id="registerForm" class="form">
      <div class="container">
        ${RegisterFormItem('row my-5 mx-3', 'email', 'EMAIL', 'text', 'email', 'email')}
        ${RegisterFormItem('row mb-5 mx-3', 'nick', 'NICK', 'text', 'nickname')}
        ${RegisterFormItem('row mb-5 mx-3', 'password', 'PASS', 'password', 'PASSWORD', 'new-password')}
        ${RegisterFormItem('row mb-5 mx-3', 'passwordRe', 'PASS(re)', 'password', 'PASSWORD', 'new-password')}
      </div>
    </form>
  `;
};

export default RegisterForm;
