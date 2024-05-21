const EditProfileForm = ({ nick, comment }) => {
  return `
	<form id="editProfileForm" class="container-fluid" >
		<div class="row d-flex flex-row p-2 mb-5">
			<div class="col-5 d-flex align-items-center justify-content-start fs-8">
				<label for="editNickname" class="form-label">NICK</label>
			</div>
			<div class="col-1 d-flex align-items-center fs-8">:</div>
			<div class="col-6 d-flex align-items-center justify-content-center fs-8">
				<input type="text" id="editNickname" class="form-control h-100 fs-8 bg-transparent" value=${nick} />
			</div>
		</div>
		
		<div class="row d-flex flex-row p-2">
			<div class="col-5 d-flex align-items-center justify-content-start fs-8">
				<label for="editComment" class="form-label">COMMENT</label>
			</div>
			<div class="col-1 d-flex align-items-center fs-8">:</div>
			<div class="col-6 d-flex align-items-center justify-content-center fs-8">
				<textarea type="text" id="editComment" class="form-control fs-8 bg-transparent">${comment}</textarea>
			</div>
		</div>
		
	</form>
	`;
};
export default EditProfileForm;
