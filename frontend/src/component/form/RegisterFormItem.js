const RegisterFormItem = (classList, labelId, content, type, placeholder) => {
  return `
    <div class="${classList}">
      <div class="col-5 d-flex align-items-center justify-content-start fs-8">
        <label for="${labelId}" class="form-label">${content}</label>
      </div>
      <div class="col-1 d-flex align-items-center fs-8">:</div>
      <div class="col-6 d-flex align-items-center justify-content-center fs-8">
        <input type="${type}" id="${labelId}" class="form-control border-2 border-top-0 border-start-0 border-end-0 h-100 fs-8 bg-transparent" placeholder="${placeholder}"></input>
      </div>
    </div>
  `;
};

export default RegisterFormItem;
