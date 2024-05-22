import PageComponent from '@component/PageComponent.js';
import FriendInfoCard from '@component/card/FriendInfoCard';
import FriendPageButtons from '@component/button/FriendPageButtons';
import FriendWaitListItem from '@component/contents/FriendWaitListItem';
import FriendSearchListItem from '@component/contents/FriendSearchListItem';
import ModalComponent from '@component/modal/ModalComponent';
import FriendWaitList from '@component/contents/FriendWaitList';
import FriendSearch from '@component/contents/FriendSearch';
import Pagination from '@component/navigation/Pagination';
import Fetch from '@/utils/Fetch';
import debounce from '@/utils/debounce';
import ErrorHandler from '@/utils/ErrorHandler';

class Friends extends PageComponent {
  constructor() {
    super();
    this.setTitle('Friends');
  }

  async getFriends() {
    const URL = `/friends/friend_list?limit=${this.limit}&offset=${this.offset}`;
    const response = await Fetch.get(URL).catch(() => {
      document.getElementById('pagination').classList.add('d-none');
      ErrorHandler.setToast('Failed to get friends list');
      return [];
    });
    this.totalPage = response.total;
    return response.friends;
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

  async getPageData() {
    const friendList = await this.getFriends();
    if (friendList.length === 0) {
      document.getElementById('pagination').classList.add('d-none');
      return `<div class="fs-15 align-self-center"> No Friends :( </div>`;
    }
    document.getElementById('pagination').classList.remove('d-none');

    const friends = friendList
      .map((data) =>
        FriendInfoCard({
          id: data.friend_user,
          name: data.friend_info.username,
          win: data.friend_info.win,
          lose: data.friend_info.lose,
          comment: data.friend_info.comment,
          isActive: data.friend_info.is_active,
          profileImg: data.friend_info.image,
        })
      )
      .join('');
    return `
      <div class="row row-cols-lg-2 w-100">
        ${friends}
      </div>
    `;
  }

  async render() {
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
        <div class="d-flex flex-row pe-5">
          ${FriendPageButtons()}
          <button id="testBtn" class="btn btn-no-outline-hover fs-7 bg-danger"> > Test </button>
        </div>
      </div>
      <div id="pageBody" class="d-flex flex-wrap justify-content-evenly overflow-auto h-75">
      </div>
      ${Pagination({ currPage: this.currPage, totalPage: this.totalPage })}
      `;
  }

  async searchFriend(friendName) {
    try {
      await Fetch.get(`/friends/add?search_name=${friendName}`);
    } catch (err) {
      ErrorHandler.setToast(err.error || 'search failed');
    }
  }

  async addFriend(friendName) {
    try {
      await Fetch.patch('/friends/add/', { friend_name: friendName });
    } catch (err) {
      ErrorHandler.setToast(err.error || 'add failed');
    }
  }

  async afterRender() {
    await this.initPageData(this);
    this.onReloadButtonClick(this);
    this.onPaginationClick(this);
    await this.addFriendWaitModalEvent();
    await this.addFriendAddModalEvent();

    document.getElementById('testBtn').addEventListener('click', async () => {
      const friendName = 'hyobicho';
      await this.searchFriend(friendName);
      await this.addFriend(friendName);
    });
  }
}

export default Friends;
