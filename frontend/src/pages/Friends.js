import PageComponent from '@component/PageComponent.js';
import FriendInfoCard from '@component/card/FriendInfoCard';
import FriendPageButtons from '@component/button/FriendPageButtons';
import FriendWaitListItem from '@component/contents/FriendWaitListItem';
import FriendSearchListItem from '@component/contents/FriendSearchListItem';
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
    return `
      <h1 class="fs-15">Friends</h1>
      <div class="d-flex flex-row justify-content-end" style="padding-right: 10%">
        ${FriendPageButtons()}
      </div>
      <div class="d-flex flex-wrap justify-content-evenly overflow-auto h-75">
        ${dummyFriends.map((friend) => FriendInfoCard(friend)).join('')}
      </div>
      `;
  }

  async afterRender() {
    initTooltip();
    await this.addFriendWaitModalEvent();
    await this.addFriendAddModalEvent();
  }
}

export default Friends;
