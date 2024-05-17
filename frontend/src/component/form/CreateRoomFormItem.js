const CreateRoomFormItem = ({ labelFor, labelContent, content }) => {
  return `
		<div class="row h-25 w-100 fs-13 mt-4 d-flex justify-content-center align-items-center">
			<div class="col-4 h-100 fs-13 d-flex justify-content-center align-items-center">
				<label for=${labelFor} class="form-label">${labelContent}:</label>
			</div>
			<div class="col-8 h-100 p-0 d-flex flex-row justify-content-center align-items-center">
				${content}
			</div>
		</div>
	`;
};

export default CreateRoomFormItem;
