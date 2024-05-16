const BasicButton = ({
  id,
  text,
  classList = '',
  disabled = false,
  type = 'button',
  form = '',
}) => {
  const btnClass = `btn btn-no-outline-hover ${classList}`;
  return disabled
    ? `
    <button type=${type} id=${id} class="${btnClass}" form=${form} disabled> ${text} </button>
  `
    : `<button type=${type} id=${id} class="${btnClass}" form=${form}> ${text} </button>`;
};

export default BasicButton;
