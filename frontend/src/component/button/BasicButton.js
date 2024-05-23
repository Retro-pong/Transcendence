const BasicButton = ({
  id,
  text,
  classList = '',
  disabled = false,
  type = 'button',
  form = 'form',
}) => {
  return disabled
    ? `
    <button type=${type} id=${id} class="${classList}" form=${form} disabled> ${text} </button>
  `
    : `<button type=${type} id=${id} class="${classList}" form=${form}> ${text} </button>`;
};

export default BasicButton;
