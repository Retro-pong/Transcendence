import AcceptButton from '../../button/AcceptButton';
import RejectButton from '../../button/RejectButton';

const FriendWaitListItem = ({ nick }) => {
  return `
  <div class="row my-2">
    <div class="col-8 d-flex align-items-center justify-content-start fs-8">${nick}</div>
    <div class="col-2 d-flex align-items-center justify-content-center">
      ${AcceptButton()}
    </div>
    <div class="col-2 d-flex align-items-center justify-content-center">
      ${RejectButton()}
    </div>
  </div>`;
};

export default FriendWaitListItem;
