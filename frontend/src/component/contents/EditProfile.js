const editProfile = ({ nickname, comment }) => {
  return `
	<div class="container-fluid">
		<div class="row d-flex flex-row my-5">
			<div class="col-4 d-flex align-items-center justify-content-start fs-8">
				<label for="nickname" class="form-label">NICKNAME</label>
			</div>
			<div class="col-1 d-flex align-items-center fs-8">:</div>
			<div class="col-7 d-flex align-items-center justify-content-center fs-8">
				<input type="text" id="nickname" class="form-control h-100 fs-8 bg-transparent" value=${nickname} />
			</div>
		</div>
		
		<div class="row d-flex flex-row my-5">
			<div class="col-4 d-flex align-items-center justify-content-start fs-8">
				<label for="comment" class="form-label">COMMENT</label>
			</div>
			<div class="col-1 d-flex align-items-center fs-8">:</div>
			<div class="col-7 d-flex align-items-center justify-content-center fs-8">
				<textarea type="text" id="COMMENT" class="form-control h-100 fs-8 bg-transparent">${comment}</textarea>
			</div>
		</div>
		
	</div>
	`;
};
export default editProfile;
