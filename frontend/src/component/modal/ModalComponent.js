const ModalComponent = ({
  borderColor,
  title,
  modalId,
  content,
  buttonList,
}) => {
  const buttons = {
    registerBtn:
      '<button id="registerBtn" type="submit" class="btn btn-outline-light w-100 fs-12" form="registerForm" > >> REGISTER << </button>',
    submitBtn:
      '<button id="twoFactorLoginBtn" type="submit" class="btn btn-outline-light w-100 fs-12" form="login-code-form"> >> SUBMIT << </button>',
    emailVerifyBtn:
      '<button id="emailVerifyBtn" type="submit" class="btn btn-outline-light w-100 fs-12" form="emailVerifyForm"> >> VERIFY << </button>',
    profileEditBtn:
      '<button id="profileEditBtn" type="submit" class="btn btn-outline-light w-100 fs-12" form="editProfileForm"> >> EDIT << </button>',
    gameResultBtn:
      '<button id="gameResultBtn" type="button" class="btn btn-outline-light w-100 fs-12" data-bs-dismiss="modal"> >> CLOSE << </button>',
  };

  return `
  <div class="modal fade modal-lg" id="${modalId}" tabindex="-1" aria-labelledby="${modalId}Label" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content bg-black border-10 modal-border-${borderColor}">
        <div class="modal-header pt-2 m-0 d-flex flex-column rounded-top-5 border-0 bg-black">
          <button type="button" class="btn-close p-0 border-0 d-flex align-items-center justify-content-center fs-15" data-bs-dismiss="modal" aria-label="Close">X</button>
          <h1 class="modal-title fs-16" id="${modalId}Label">${title}</h1>
        </div>
        <div class="modal-body">
          ${content}
        </div>
          <div class="modal-footer border-0 bg-black rounded-bottom-5 d-flex justify-content-center align-items-center">
            ${buttonList.map((type) => buttons[type]).join('')}
          </div>
        </div>
      </div>
    </div>`;
};

export default ModalComponent;
