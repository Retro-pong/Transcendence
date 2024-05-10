import BasicButton from '@component/button/BasicButton';

const FriendWaitListItem = ({ nick }) => {
  const data = `data-nick="${nick}"`;
  return `
  <div class="row my-2">
    <div class="col-8 d-flex align-items-center justify-content-start fs-8">${nick}</div>
    <div class="col-2 d-flex align-items-center justify-content-center">
      ${BasicButton({ id: 'accept', text: 'OK', classList: 'btn btn-friend-accept rounded-5 fs-8', data })}
      </div>
      <div class="col-2 d-flex align-items-center justify-content-center">
      ${BasicButton({ id: 'reject', text: 'NO', classList: 'btn btn-friend-reject rounded-5 fs-8', data })}
    </div>
  </div>`;
};

export default FriendWaitListItem;
