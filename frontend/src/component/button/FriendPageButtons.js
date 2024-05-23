import OpenModalButton from '@component/button/OpenModalButton';
import BasicButton from '@component/button/BasicButton';

const FriendPageButtons = () => {
  const FriendWaitBtn = OpenModalButton({
    text: '> WAITING',
    classList: 'btn btn-no-outline-hover fs-7',
    modalId: '#friendWaitModal',
  });
  const FriendAddBtn = OpenModalButton({
    text: '> ADD',
    classList: 'btn btn-no-outline-hover fs-7',
    modalId: '#friendAddModal',
  });
  const ReloadRoomBtn = BasicButton({
    id: 'reloadBtn',
    text: '> Reload',
    classList: 'btn btn-no-outline-hover fs-7',
  });
  const BtnList = [`${ReloadRoomBtn}`, `${FriendWaitBtn}`, `${FriendAddBtn}`];

  return `
  	${BtnList.join('')}
	`;
};

export default FriendPageButtons;
