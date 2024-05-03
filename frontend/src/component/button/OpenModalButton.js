const OpenModalButton = ({ text, classList, modalId }) => {
  return `
    <button type="button" class="${classList}" data-bs-toggle="modal" data-bs-target="${modalId}">
      ${text}
    </button>
  `;
};

export default OpenModalButton;
