import OpenModalButton from '@component/button/OpenModalButton';
import ModalComponent from '@component/modal/ModalComponent';
import FriendWaitList from '@component/contents/FriendWaitList';
import FriendSearch from '@component/contents/FriendSearch';

const FriendPageButtons = () => {
  const FriendWaitBtn = OpenModalButton({
    text: '> WAITING',
    classList: 'btn btn-no-outline-hover fs-8',
    modalId: '#friendWaitModal',
  });
  const FriendAddBtn = OpenModalButton({
    text: '> ADD',
    classList: 'btn btn-no-outline-hover fs-8',
    modalId: '#friendAddModal',
  });
  const FriendWaitModal = ModalComponent({
    borderColor: 'mint',
    title: 'WAITING',
    modalId: 'friendWaitModal',
    content: FriendWaitList(),
    buttonList: [],
  });
  const FriendAddModal = ModalComponent({
    borderColor: 'pink',
    title: 'ADD FRIEND',
    modalId: 'friendAddModal',
    content: FriendSearch(),
    buttonList: [],
  });

  const BtnList = [
    `${FriendWaitBtn} ${FriendWaitModal}`,
    `${FriendAddBtn} ${FriendAddModal}`,
  ];

  return `
  	${BtnList.join('')}
	`;
};

export default FriendPageButtons;
