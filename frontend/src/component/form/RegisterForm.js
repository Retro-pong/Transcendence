import RegisterFormItem from './RegisterFormItem.js';

const RegisterForm = () => {
  return `
    <form id="registerForm" class="form">
      <div class="container">
        ${RegisterFormItem('row my-5 mx-3', 'email', 'EMAIL', 'text', 'email')}
        ${RegisterFormItem('row mb-5 mx-3', 'nick', 'NICK', 'text', 'nickname')}
        ${RegisterFormItem('row mb-5 mx-3', 'password', 'PASS', 'password', 'PASSWORD')}
        ${RegisterFormItem('row mb-5 mx-3', 'password-re', 'PASS(re)', 'password', 'PASSWORD')}
      </div>
    </form>
  `;
};

export default RegisterForm;
