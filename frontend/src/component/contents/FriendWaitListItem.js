const FriendWaitListItem = ({ nick }) => {
  return `
    <div class="row my-2" data-wait-item=${nick}>
      <div class="col-8 d-flex align-items-center justify-content-start fs-8">${nick}</div>
        <div class="col-2 d-flex align-items-center justify-content-center">
          <button class="friend-accept-btn btn btn-friend-accept rounded-5 fs-8" data-nick=${nick}>OK</button>
        </div>
      <div class="col-2 d-flex align-items-center justify-content-center">
        <button class="friend-reject-btn btn btn-friend-reject rounded-5 fs-8" data-nick=${nick}>NO</button>
      </div>
    </div>`;
};

export default FriendWaitListItem;
