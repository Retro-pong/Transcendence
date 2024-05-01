const RegisterForm = () => {
  return `
    <form id="registerForm" class="form">
      <div class="container">
        <div class="row my-5 mx-4">
          <div class="col-5">
              <label for="email" class="form-label">EMAIL</label>
          </div>
          <div class="col-1 d-flex align-items-center">:</div>
          <div class="col-6">
            <input type="text" id="eamil" class="form-control register-input" placeholder="name@mail.com"></input>
          </div>
        </div>
        <div class="row mb-5 mx-4">
          <div class="col-5">
          <label for="nick" class="form-label">NICKNAME</label>
          </div>
          <div class="col-1 d-flex align-items-center">:</div>
          <div class="col-6">
            <input type="text" id="nick" class="form-control register-input" placeholder="nickname"></input>
          </div>
        </div>

        <div class="row mb-5 mx-4">
          <div class="col-5">
            <label for="password" class="form-label">PASSWORD</label>
          </div>
          <div class="col-1 d-flex align-items-center">:</div>
          <div class="col-6">
            <input type="password" id="password" class="form-control register-input"></input>
          </div>
        </div>

        <div class="row mb-5 mx-4">
          <div class="col-5">
            <label for="password-re" class="form-label">PASSWORD</label>
          </div>
          <div class="col-1 d-flex align-items-center">:</div>
          <div class="col-6">
            <input type="password" id="password-re" class="form-control register-input"></input>
          </div>
        </div>
      </div>
    </form>
  `;
};

export default RegisterForm;
