const ProfileItem = ({ type, content }) => {
  const contentId = `profile-${type}`;
  const contentItem =
    type === 'comment'
      ? `<textarea id=${contentId} class="col-7 bg-transparent border-0 text-white" style="resize: none" disabled>${content}</textarea>`
      : `<div id=${contentId} class="col-7 overflow-y-scroll overflow-scrollbar-x">${content}</div>`;

  return `
	<div class="row">
		 	<div class="col-4 overflow-y-scroll overflow-scrollbar-x text-white-50">${type === 'username' ? 'nick' : type}</div>
	  	<div class="col-1 text-white-50"></div>
	  	${contentItem}
	</div>
	
	`;
};
export default ProfileItem;
