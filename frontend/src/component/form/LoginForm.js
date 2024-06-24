const LoginForm = () => {
  return `
    <div class="container">
      <div class="fs-2 text-start">We've sent a passcode to your email!<br>Please verify your passcode.</div>
      <form id="login-code-form" class="form-floating p-4">
        <div class="row justify-content-center">
          <div class="col-6">
            <input type="text" minlength="6" maxlength="6" id="passcode" class="form-control text-center fs-8 bg-transparent code-input" placeholder="passcode" autocomplete="one-time-code"/>
          </div>
        </div>
      </form>
    </>
  `;
};

export default LoginForm;
