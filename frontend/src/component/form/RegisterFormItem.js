const RegisterFormItem = (classList, labelId, content, type, placeholder) => {
  return `
    <div class="${classList}">
      <div class="col-md-6 d-flex align-items-center justify-content-start fs-8">
        <div class="col-9 d-flex align-items-center justify-content-start fs-8">
          <label for="${labelId}" class="form-label mb-0">${content}</label>
        </div>
        <div class="col-3 d-flex align-items-center fs-8 d-none d-md-block">:</div>
      </div>
      <div class="col-md-6 d-flex align-items-center justify-content-center fs-8">
        <input type="${type}" id="${labelId}" class="form-control h-100 fs-8 bg-transparent" placeholder="${placeholder}" />
      </div>
    </div>
  `;
};

export default RegisterFormItem;
