const FriendSearchListItem = ({ nick }) => {
  return `
  <div class="row my-2 px-5">
    <div class="col-10 fs-10">${nick}</div>
    <button id="friendAdd" class="btn fs-8 col-2 btn-no-outline-hover bg-transparent">+</button>
  </div>
  `;
};

export default FriendSearchListItem;
