const FriendSearchListItem = ({ nick }) => {
  return `
  <div class="row my-2 px-5 h-25 d-flex justify-content-center align-items-center">
    <div class="col-10 fs-10">${nick}</div>
    <button class="col-2 friend-add-btn btn btn-no-outline-hover bg-transparent fs-8" data-nick=${nick}>+</button>
  </div>
  `;
};

export default FriendSearchListItem;
