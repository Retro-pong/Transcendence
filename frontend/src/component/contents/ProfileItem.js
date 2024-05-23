const ProfileItem = ({ type, content }) => {
  if (type === 'comment') {
    return `
	  <div class="row">
	  	<div class="col-4">${type}</div>
	  	<div class="col-1">:</div>
	  	<textarea class="col-7 bg-transparent border-0 text-white" style="resize: none" disabled>${content}</textarea>
	  </div>
		`;
  }
  return `
	<div class="row">
		 	<div class="col-4">${type}</div>
	  	<div class="col-1">:</div>
	  	<div class="col-7 overflow-scrollbar-x">${content}</div>
	</div>
	
	`;
};
export default ProfileItem;
