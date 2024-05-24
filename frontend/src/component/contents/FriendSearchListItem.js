const FriendSearchListItem = ({ nick }) => {
  return `
  <div class="row my-2 px-5">
    <div class="col-10 fs-10">${nick}</div>
    <button class="btn fs-8 col-2 btn-no-outline-hover bg-transparent" data-nick=${nick}>+</button>
  </div>
  `;
};

export default FriendSearchListItem;
