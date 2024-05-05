import PageComponent from '@component/PageComponent.js';
import OpenModalButton from '@component/button/OpenModalButton';
import ModalComponent from '@component/modal/ModalComponent';
import FriendWaitList from '@component/contents/FriendWaitList';
import FriendSearch from '@component/contents/FriendSearch';
import FriendInfoCard from '@component/card/FriendInfoCard';
import initTooltip from '@/utils/initTooltip';

class Friends extends PageComponent {
  constructor() {
    super();
    this.setTitle('Friends');
  }

  // TODO: 친구 목록 api 요청
  async getFriends() {
    return [
      {
        id: 1,
        name: 'hyobicho',
        win: 99,
        lose: 1,
        comment: 'hello world',
        status: 'online',
        profileImg:
          'https://www.blueconomy.co.kr/news/photo/202402/2399_3001_921.png',
      },
      {
        id: 2,
        name: 'hyungjpa',
        win: 10,
        lose: 1,
        comment: '',
        status: 'offline',
        profileImg:
          'https://www.blueconomy.co.kr/news/photo/202402/2399_3001_921.png',
      },
      {
        id: 3,
        name: 'wonjilee',
        win: 1,
        lose: 99,
        comment: '동해물과 백두산이',
        status: 'online',
        profileImg:
          'https://www.blueconomy.co.kr/news/photo/202402/2399_3001_921.png',
      },
      {
        id: 4,
        name: 'subinlee',
        win: 5,
        lose: 5,
        comment: '🥳🥳🥳 this is a very long comment hahaha',
        status: 'offline',
        profileImg:
          'https://www.blueconomy.co.kr/news/photo/202402/2399_3001_921.png',
      },
      {
        id: 5,
        name: 'kitty',
        win: 1511,
        lose: 95,
        comment: 'meooooow',
        status: 'online',
        profileImg:
          'https://i.pinimg.com/236x/91/be/98/91be9861cc5cef854ccc3f8ece507918.jpg',
      },
      {
        id: 6,
        name: 'puppy',
        win: 124,
        lose: 94,
        comment: 'woff woff',
        status: 'offline',
        profileImg:
          'https://img4.daumcdn.net/thumb/R658x0.q70/?fname=https://t1.daumcdn.net/news/202105/25/holapet/20210525081724428qquq.jpg',
      },
    ];
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
    const dummyFriends = await this.getFriends();
    return `
      <h1>Friends</h1>
      <div class="d-flex justify-content-between">
        ${BtnList.join('')}
      </div>
      <div class="d-flex flex-wrap justify-content-evenly h-75 overflow-auto">
        ${dummyFriends.map((friend) => FriendInfoCard(friend)).join('')}
      </div>
      `;
  }

  async afterRender() {
    initTooltip();
  }
}

export default Friends;
