const FriendSearchListItem = ({ nick }) => {
  return `
  <div class="row my-2 px-4 d-flex justify-content-center align-items-center">
    <div class="col-10 fs-10 text-wrap text-break" data-add-btn-target=${nick}>${nick}</div>
    <button class="col-2 friend-request-btn btn btn-no-outline-hover fs-8" data-nick=${nick}>+</button>
  </div>
  `;
};

export default FriendSearchListItem;
