const BasicButton = ({
  id,
  text,
  classList = '',
  disabled = false,
  data = '',
}) => {
  const btnClass = `btn btn-no-outline-hover ${classList}`;
  return disabled
    ? `
    <button type="button" id=${id} class="${btnClass}" disabled ${data}> ${text} </button>
  `
    : `<button type="button" id=${id} class="${btnClass} ${data}"> ${text} </button>`;
};

export default BasicButton;
