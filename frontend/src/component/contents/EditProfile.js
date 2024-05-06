const editProfile = ({ nickname, comment }) => {
  return `
	<form class="container-fluid px-5">
		<div class="row d-flex flex-row my-5">
			<div class="col-5 d-flex align-items-center justify-content-start fs-8">
				<label for="name" class="form-label">NAME</label>
			</div>
			<div class="col-1 d-flex align-items-center fs-8">:</div>
			<div class="col-6 d-flex align-items-center justify-content-center fs-8">
				<input type="text" id="name" class="form-control h-100 fs-8 bg-transparent" value=${nickname} />
			</div>
		</div>
		
		<div class="row d-flex flex-row my-5">
			<div class="col-5 d-flex align-items-center justify-content-start fs-8">
				<label for="comment" class="form-label">COMMENT</label>
			</div>
			<div class="col-1 d-flex align-items-center fs-8">:</div>
			<div class="col-6 d-flex align-items-center justify-content-center fs-8">
				<textarea type="text" id="comment" class="form-control h-100 fs-8 bg-transparent">${comment}</textarea>
			</div>
		</div>
		
	</form>
	`;
};
export default editProfile;
