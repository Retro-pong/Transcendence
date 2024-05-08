import PageComponent from '@component/PageComponent.js';
import OpenModalButton from '@component/button/OpenModalButton';
import ModalComponent from '@component/modal/ModalComponent';
import FriendWaitList from '@component/contents/FriendWaitList';
import FriendSearch from '@component/contents/FriendSearch';
import FriendInfoCard from '@component/card/FriendInfoCard';
import initTooltip from '@/utils/initTooltip';
import Fetch from '@/utils/Fetch';

class Friends extends PageComponent {
  constructor() {
    super();
    this.setTitle('Friends');
  }

  // TODO: 친구 목록 api 요청
  async getFriends() {
    return Fetch.get('/friends');
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
    const dummyFriends = (await this.getFriends()) || [];
    return `
      <h1 class="fs-15">Friends</h1>
      <div class="d-flex flex-row justify-content-end" style="padding-right: 10%">
        ${BtnList.join('')}
      </div>
      <div class="d-flex flex-wrap justify-content-evenly overflow-auto h-75">
        ${dummyFriends.map((friend) => FriendInfoCard(friend)).join('')}
      </div>
      `;
  }

  async afterRender() {
    initTooltip();
  }
}

export default Friends;
