const UserProfileInfo = ({ nickname, email, winLose, comment }) => {
  return `
	  <div class="row">
	  	<div class="col-4">NICKNAME</div>
	  	<div class="col-1">:</div>
	  	<div class="col-7">${nickname}</div>
	  </div>
	  <div class="row">
	  	<div class="col-4">EMAIL</div>
	  	<div class="col-1">:</div>
	  	<div class="col-7 overflow-y-scroll overflow-scrollbar-x">${email}</div>
	  </div>
	  <div class="row">
	  	<div class="col-4">WIN / LOSE</div>
	  	<div class="col-1">:</div>
	  	<div class="col-7">${winLose}</div>
	  </div>
	  <div class="row">
	  	<div class="col-4">COMMENT</div>
	  	<div class="col-1">:</div>
	  	<textarea class="col-7 bg-transparent border-0 text-white" style="resize: none"  disabled>${comment}</textarea>
	  </div>
	`;
};

export default UserProfileInfo;
