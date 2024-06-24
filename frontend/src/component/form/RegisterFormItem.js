const RegisterFormItem = (
  classList,
  labelId,
  content,
  type,
  placeholder,
  autocomplete = 'on'
) => {
  const code = labelId.startsWith('email') ? 'code-input' : '';

  return `
    <div class="${classList}">
      <div class="col-md-6 d-flex align-items-center justify-content-start fs-7">
        <div class="col-9 d-flex align-items-center justify-content-start fs-7">
          <label for="${labelId}" class="form-label mb-0">${content}</label>
        </div>
        <div class="col-3 d-flex align-items-center fs-7 d-none d-md-block">:</div>
      </div>
      <div class="col-md-6 d-flex align-items-center justify-content-center fs-7">
        <input type="${type}" id="${labelId}" class="form-control h-100 fs-7 bg-transparent ${code}" placeholder="${placeholder}" autocomplete="${autocomplete}" />
      </div>
    </div>
  `;
};

export default RegisterFormItem;
