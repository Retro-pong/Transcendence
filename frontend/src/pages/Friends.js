import PageComponent from '@component/PageComponent.js';
import FriendInfoCard from '@component/card/FriendInfoCard';
import FriendPageButtons from '@component/button/FriendPageButtons';
import FriendWaitListItem from '@component/contents/FriendWaitListItem';
import FriendSearchListItem from '@component/contents/FriendSearchListItem';
import Pagination from '@component/navigation/Pagination';
import ModalComponent from '@component/modal/ModalComponent';
import FriendWaitList from '@component/contents/FriendWaitList';
import FriendSearch from '@component/contents/FriendSearch';
import initTooltip from '@/utils/initTooltip';
import Fetch from '@/utils/Fetch';
import debounce from '@/utils/debounce';

class Friends extends PageComponent {
  constructor() {
    super();
    this.setTitle('Friends');
  }

  // TODO: 친구 목록 api 요청
  async getFriends() {
    return Fetch.get('/friends');
  }

  async getWaitingFriends() {
    return Fetch.get('/friends-wait-list');
  }

  async getSearchFriends(friendName) {
    return Fetch.get('/friends-search', { friendName });
  }

  async addFriendWaitModalEvent() {
    const friendWaitModal = document.getElementById('friendWaitModal');
    const friendWaitList = document.getElementById('friendWaitListContainer');

    friendWaitModal.addEventListener('hide.bs.modal', () => {
      while (friendWaitList.firstChild) {
        friendWaitList.removeChild(friendWaitList.firstChild);
      }
    });

    friendWaitModal.addEventListener('show.bs.modal', async () => {
      const waitingFriends = await this.getWaitingFriends();
      waitingFriends.map((friend) =>
        friendWaitList.appendChild(FriendWaitListItem({ nick: friend }))
      );
    });
  }

  async addFriendAddModalEvent() {
    const friendAddModal = document.getElementById('friendAddModal');
    const input = document.getElementById('searchFriend');
    const friendSearchList = document.getElementById(
      'friendSearchListContainer'
    );

    friendAddModal.addEventListener('hide.bs.modal', () => {
      input.value = '';
      while (friendSearchList.firstChild) {
        friendSearchList.removeChild(friendSearchList.firstChild);
      }
    });

    input.addEventListener(
      'input',
      debounce(async (e) => {
        const searchResult = await this.getSearchFriends(e.target.value);
        searchResult.map((friend) =>
          friendSearchList.appendChild(FriendSearchListItem({ nick: friend }))
        );
      }, 1000)
    );
  }

  async render() {
    const dummyFriends = (await this.getFriends()) || [];
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

    return `
      ${FriendWaitModal}
      ${FriendAddModal}
      <div class="d-flex justify-content-between position-sticky top-0 z-1">
        <h1 class="fs-14">Friends</h1>
        <div class="d-flex flex-row" style="padding-right: 5%">
          ${FriendPageButtons()}
        </div>
      </div>
      <div class="d-flex flex-wrap justify-content-evenly overflow-auto h-90">
        ${dummyFriends.map((friend) => FriendInfoCard(friend)).join('')}
      </div>
      ${Pagination({ currPage: this.currPage, totalPage: this.totalPage })}
      `;
  }

  async afterRender() {
    initTooltip();
    await this.addFriendWaitModalEvent();
    await this.addFriendAddModalEvent();
  }
}

export default Friends;
