import PageComponent from '@component/PageComponent.js';
import OpenModalButton from '@component/button/OpenModalButton';
import ModalComponent from '@component/modal/ModalComponent';
import FriendWaitList from '@component/contents/FriendWaitList';
import FriendSearch from '@component/contents/FriendSearch';
import FriendInfoCard from '@component/card/FriendInfoCard';

class Friends extends PageComponent {
  constructor() {
    super();
    this.setTitle('Friends');
  }

  async render() {
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
      <h1>Friends</h1>
      <div class="d-flex justify-content-between">
        ${BtnList.join('')}
      </div>
      ${FriendInfoCard()}
      `;
  }
}

export default Friends;
