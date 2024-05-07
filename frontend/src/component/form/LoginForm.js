const LoginForm = () => {
  return `
    <div class="container">
      <div class="fs-2 text-start">We've sent a passcode to your email!<br>Please verify your passcode.</div>
      <form id="loginForm" class="form-floating p-4">
        <div class="row justify-content-center">
          <div class="col-6">
            <input type="text" pattern="[0-9]+" minlength="6" maxlength="6" id="passcode" class="form-control text-center fs-8 bg-transparent" placeholder="passcode" />
          </div>
          <div id="timer" class="col-2 align-self-center fs-7 text-bg-info rounded-2 bg-opacity-10">
            5:00
          </div>
        </div>
      </form>
    </>
  `;
};

export default LoginForm;
