const EditProfileForm = ({ nick, comment }) => {
  return `
	<form id="editProfileForm" class="container-fluid px-5" >
		<div class="row d-flex flex-row mb-5 px-2 fs-8">
			<div class="col-5 d-flex align-items-center justify-content-start">
				<label for="editNickname" class="form-label">NICK</label>
			</div>
			<div class="col-1 d-flex align-items-center">:</div>
			<div class="col-6 d-flex align-items-center justify-content-center">
				<input type="text" id="editNickname" class="form-control h-100 bg-transparent text-white fs-8" value=${nick} />
			</div>
		</div>
		
		<div class="row d-flex flex-row px-2 fs-8">
			<div class="col-5 d-flex align-items-center justify-content-start">
				<label for="editComment" class="form-label">COMMENT</label>
			</div>
			<div class="col-1 d-flex align-items-center">:</div>
			<div class="col-6 d-flex align-items-center justify-content-center">
				<textarea type="text" id="editComment" class="form-control bg-transparent fs-8">${comment}</textarea>
			</div>
		</div>
		
	</form>
	`;
};
export default EditProfileForm;
