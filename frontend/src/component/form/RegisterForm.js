import RegisterFormItem from './RegisterFormItem.js';

const RegisterForm = () => {
  return `
    <form id="registerForm" class="form">
      <div class="container">
        ${RegisterFormItem('row my-5 mx-4', 'email', 'EMAIL', 'text', 'name @ mail')}
        ${RegisterFormItem('row mb-5 mx-4', 'nick', 'NICKNAME', 'text', 'nickname')}
        ${RegisterFormItem('row mb-5 mx-4', 'password', 'PASSWORD', 'password', 'PASSWORD')}
        ${RegisterFormItem('row mb-5 mx-4', 'password-re', 'PASSWORD', 'password', 'PASSWORD')}
      </div>
    </form>
  `;
};

export default RegisterForm;
