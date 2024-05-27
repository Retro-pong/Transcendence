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
import Regex from '@/constants/Regex';

class Friends extends PageComponent {
  constructor() {
    super();
    this.setTitle('Friends');
  }

  async getFriends() {
    const URL = `/friends/friend_list/?limit=${this.limit}&offset=${this.offset}`;
    const response = await Fetch.get(URL).catch(() => {
      document.getElementById('pagination').classList.add('d-none');
      ErrorHandler.setToast('Failed to get friends list');
      return [];
    });
    this.totalPage = response.total;
    return response.friends;
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

  onFriendAcceptBtnClick() {
    document.querySelectorAll('.friend-accept-btn').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        const friendName = e.target.dataset.nick;
        await Fetch.patch('/friends/waiting/', {
          friend_name: friendName,
          request_patch: '1',
        })
          .then(async () => {
            await this.initPageData(this);
            this.onReloadButtonClick(this);
            this.onPaginationClick(this);
            ErrorHandler.setToast('Friend accepted');
          })
          .catch(() => {
            ErrorHandler.setToast('Failed to accept friend');
          });
      });
    });
  }

  onFriendRejectBtnClick() {
    document.querySelectorAll('.friend-reject-btn').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        const friendName = e.target.dataset.nick;
        await Fetch.patch('/friends/waiting/', {
          friend_name: friendName,
          request_patch: '0',
        })
          .then(() => {
            ErrorHandler.setToast('Friend rejected');
            btn.remove();
          })
          .catch(() => {
            ErrorHandler.setToast('Failed to reject friend');
          });
      });
    });
  }

  onFriendRequestBtnClick() {
    document.querySelectorAll('.friend-request-btn').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        const friendName = e.target.dataset.nick;
        await Fetch.patch('/friends/add/', { friend_name: friendName })
          .then(() => {
            ErrorHandler.setToast(`friend request ${friendName}`);
          })
          .catch((error) => {
            // TODO: 이미 요청 보낸 친구에게 재요청시 에러처리
            console.log(error);
            ErrorHandler.setToast(`failed to friend request ${friendName}`);
          });
      });
    });
  }

  onFriendWaitModalEvent() {
    const friendWaitModal = document.getElementById('friendWaitModal');
    const friendWaitList = document.getElementById('friendWaitListContainer');

    friendWaitModal.addEventListener('hide.bs.modal', () => {
      while (friendWaitList.firstChild) {
        friendWaitList.removeChild(friendWaitList.firstChild);
      }
    });

    friendWaitModal.addEventListener('show.bs.modal', async () => {
      await Fetch.get('/friends/waiting/')
        .then((res) => {
          friendWaitList.innerHTML =
            res
              .map((friend) => FriendWaitListItem({ nick: friend.friend_name }))
              .join('') || 'No waiting list';
          // 친구 수락, 거절 버튼에 이벤트 추가
          this.onFriendAcceptBtnClick();
          this.onFriendRejectBtnClick();
        })
        .catch(() => {
          ErrorHandler.setToast('Failed to get waiting list');
        });
    });
  }

  onFriendAddModalEvent() {
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

    // 친구 검색창 이벤트
    input.addEventListener(
      'input',
      debounce(async (e) => {
        const username = e.target.value;
        if (Regex.nickname.test(username) === false) {
          ErrorHandler.setToast('Invalid nickname');
          return;
        }
        await Fetch.get(`/friends/add?search_name=${username.toLowerCase()}`)
          .then((res) => {
            // 친구 검색 결과 생성
            friendSearchList.innerHTML =
              res
                .map((friend) =>
                  FriendSearchListItem({ nick: friend.username })
                )
                .join('') || 'No search results';
            // 친구 추가 버튼에 이벤트 추가
            this.onFriendRequestBtnClick();
            friendSearchList.scrollIntoView({ behavior: 'smooth' });
          })
          .catch(() => {
            ErrorHandler.setToast('search failed');
          });
      }, 1000)
    );
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
        </div>
      </div>
      <div id="pageBody" class="d-flex flex-wrap justify-content-evenly overflow-auto h-75">
      </div>
      ${Pagination({ currPage: this.currPage, totalPage: this.totalPage })}
      `;
  }

  async afterRender() {
    await this.initPageData(this);
    this.onReloadButtonClick(this);
    this.onPaginationClick(this);
    this.onFriendWaitModalEvent();
    this.onFriendAddModalEvent();
  }
}

export default Friends;
