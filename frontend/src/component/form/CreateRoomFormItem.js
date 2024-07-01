const CreateRoomFormItem = ({
  titleId,
  title,
  content,
  label = false,
  contentCustom = false,
}) => {
  const titleItem = label
    ? `<label for=${titleId} class="form-label">${title}:</label>`
    : `<div id=${titleId}>${title}:</div>`;

  const contentItem = contentCustom
    ? `${content}`
    : `<div class="col-md-8 h-100 d-flex flex-row justify-content-center align-items-center overflow-scroll">
				${content}
			</div>`;

  return `
		<div class="row h-25 w-100 fs-13 pt-4 d-flex justify-content-center align-items-center">
			<div class="col-md-4 h-100 fs-13 d-flex justify-content-center align-items-center">
				${titleItem}
			</div>
			${contentItem}
		</div>
	`;
};

export default CreateRoomFormItem;
