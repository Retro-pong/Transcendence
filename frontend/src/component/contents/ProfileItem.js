const ProfileItem = ({ type, content }) => {
  if (type === 'comment') {
    return `
	  <div class="row">
	  	<div class="col-4 overflow-y-scroll overflow-scrollbar-x">${type}</div>
	  	<div class="col-1">:</div>
	  	<textarea class="col-7 bg-transparent border-0 text-white" style="resize: none" disabled>${content ?? 'Please write a comment'}</textarea>
	  </div>
		`;
  }
  return `
	<div class="row">
		 	<div class="col-4 overflow-y-scroll overflow-scrollbar-x">${type === 'username' ? 'nick' : type}</div>
	  	<div class="col-1">:</div>
	  	<div class="col-7 overflow-y-scroll overflow-scrollbar-x">${content}</div>
	</div>
	
	`;
};
export default ProfileItem;
