const BasicButton = ({ id, text, classList = '', disabled = false }) => {
  const btnClass = `btn btn-no-outline-hover ${classList}`;
  return disabled
    ? `
    <button type="button" id=${id} class="${btnClass}" disabled> ${text} </button>
  `
    : `<button type="button" id=${id} class="${btnClass}"> ${text} </button>`;
};

export default BasicButton;
