const RegisterForm = () => {
  return `
    <form id="registerForm" class="form">
      <div class="container">
        <div class="row my-4 mx-3">
          <div class="col-5">
              <label for="email" class="form-label">EMAIL</label>
          </div>
          <div class="col-2">:</div>
          <div class="col-5">
            <input type="text" id="eamil" class="form-control" placeholder="name@mail.com"></input>
          </div>
        </div>
          
        <div class="row mb-4 mx-3">
          <div class="col-5">
          <label for="nick" class="form-label">NICKNAME</label>
          </div>
          <div class="col-2">:</div>
          <div class="col-5">
            <input type="text" id="nick" class="form-control" placeholder="nickname"></input>
          </div>
        </div>

        <div class="row mb-4 mx-3">
          <div class="col-5">
            <label for="password" class="form-label">PASSWORD</label>
          </div>
          <div class="col-2">:</div>
          <div class="col-5">
            <input type="password" id="password" class="form-control"></input>
          </div>
        </div>

        <div class="row mb-4 mx-3">
          <div class="col-5">
            <label for="password-re" class="form-label">PASSWORD(RE)</label>
          </div>
          <div class="col-2">:</div>
          <div class="col-5">
            <input type="password" id="password-re" class="form-control"></input>
          </div>
        </div>
      </div>
    </form>
  `;
};

export default RegisterForm;
