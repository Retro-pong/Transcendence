const OpenModalButton = ({ text, classList, modalId }) => {
  console.log(classList);
  return `
    <button type="button" class="${classList}" data-bs-toggle="modal" data-bs-target="${modalId}">
    <span class="fs-1">
    ${text}
    </span>
    </button>
  `;
};

export default OpenModalButton;
