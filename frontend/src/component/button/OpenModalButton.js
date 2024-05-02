const OpenModalButton = ({ text, classList, modalId }) => {
  console.log(classList);
  return `
    <button type="button" class="${classList}" data-bs-toggle="modal" data-bs-target="${modalId}">
      ${text}
    </button>
  `;
};

export default OpenModalButton;
