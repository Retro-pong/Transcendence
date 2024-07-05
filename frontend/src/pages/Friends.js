import PageComponent from '@component/PageComponent.js';
import FriendInfoCard from '@component/card/FriendInfoCard';
import FriendPageButtons from '@component/button/FriendPageButtons';
import FriendWaitListItem from '@component/contents/FriendWaitListItem';
import FriendSearchListItem from '@component/contents/FriendSearchListItem';
import ModalComponent from '@component/modal/ModalComponent';
import FriendWaitList from '@component/contents/FriendWaitList';
import FriendSearch from '@component/contents/FriendSearch';
import BattleHistory from '@component/contents/BattleHistory';
import Pagination from '@component/navigation/Pagination';
import Fetch from '@/utils/Fetch';
import debounce from '@/utils/debounce';
import ToastHandler from '@/utils/ToastHandler';
import Regex from '@/constants/Regex';

class Friends extends PageComponent {
  constructor() {
    super();
    this.setTitle('Friends');
    this.friendDetailMap = new Map();
  }

  async getFriends() {
    const URL = `/friends/friend_list/?limit=${this.limit}&offset=${this.offset}`;
    try {
      const response = await Fetch.get(URL);
      this.totalPage = response.total;
      return response.friends;
    } catch (err) {
      document.getElementById('pagination').classList.add('d-none');
      ToastHandler.setToast('Failed to get friends list');
      return [];
    }
  }

  async getPageData() {
    const friendList = await this.getFriends();
    this.friendDetailMap.clear();
    if (friendList.length === 0) {
      document.getElementById('pagination').classList.add('d-none');
      return `<div class="fs-15 align-self-center"> No Friends :( </div>`;
    }
    document.getElementById('pagination').classList.remove('d-none');

    const friends = friendList
      .map((data) => {
        this.friendDetailMap.set(`friend${data.friend_user}`, {
          username: data.friend_info.username,
          history: data.friend_info.history,
        });
        return FriendInfoCard({
          id: data.friend_user,
          name: data.friend_info.username,
          win: data.friend_info.win,
          lose: data.friend_info.lose,
          comment: data.friend_info.comment,
          isActive: data.friend_info.is_active,
          profileImg: data.friend_info.image,
        });
      })
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
          .then(async (res) => {
            if (res.status === 201) {
              await this.initPageData(this);
              this.onReloadButtonClick(this);
              this.onPaginationClick(this);
              ToastHandler.setToast('Friend accepted');
            }
          })
          .catch((err) => {
            ToastHandler.setToast(
              `${err.message || 'Failed to accept friend'}`
            );
          })
          .finally(() => {
            document.querySelector(`[data-wait-item="${friendName}"]`).remove();
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
          .then((res) => {
            if (res.status === 200) {
              ToastHandler.setToast('Friend rejected');
            }
          })
          .catch((err) => {
            ToastHandler.setToast(
              `${err.message || 'Failed to reject friend'}`
            );
          })
          .finally(() => {
            document.querySelector(`[data-wait-item="${friendName}"]`).remove();
          });
      });
    });
  }

  onFriendRequestBtnClick() {
    document.querySelectorAll('.friend-request-btn').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        const friendName = e.target.dataset.nick;
        await Fetch.patch('/friends/add/', { friend_name: friendName })
          .then((res) => {
            if (res.status === 200) {
              ToastHandler.setToast(res.data.error || 'Already a friend');
            }
            if (res.status === 201) {
              ToastHandler.setToast(`sent a friend request to ${friendName}`);
            }
          })
          .catch((err) => {
            ToastHandler.setToast(
              `${err.message || 'Failed to send friend request'}`
            );
          });
      });
      btn.addEventListener('mouseover', (e) => {
        const friendName = e.target.dataset.nick;
        document
          .querySelector(`[data-add-btn-target="${friendName}"]`)
          .classList.add('text-success');
      });
      btn.addEventListener('mouseout', (e) => {
        const friendName = e.target.dataset.nick;
        document
          .querySelector(`[data-add-btn-target="${friendName}"]`)
          .classList.remove('text-success');
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
          ToastHandler.setToast('Failed to get waiting list');
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
          ToastHandler.setToast('Invalid nickname');
          return;
        }
        await Fetch.get(`/friends/add/?search_name=${username.toLowerCase()}`)
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
          .catch((err) => {
            ToastHandler.setToast(`${err.message || 'Search Failed'}`);
          });
      }, 1000)
    );
  }

  onFriendDeleteBtnClick() {
    document.querySelectorAll('.card .btn-close').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        const friendName = e.target.dataset.nick;
        Fetch.patch(`/friends/friend_list/`, { friend_name: friendName })
          .then((res) => {
            ToastHandler.setToast(
              res.message || `Friend ${friendName} deleted`
            );
            this.initPageData(this);
          })
          .catch((err) => {
            ToastHandler.setToast(
              `${err.message || 'Failed to delete friend'}`
            );
          });
      });
    });
  }

  onFriendDetailModalEvent() {
    const friendDetailModal = document.getElementById('friendDetailModal');
    friendDetailModal.addEventListener('show.bs.modal', async (e) => {
      const friendId = e.relatedTarget.id;
      const friendInfo = this.friendDetailMap.get(friendId);
      const modalBody = document.querySelector(
        '#friendDetailModal .modal-body'
      );
      modalBody.innerHTML = `
    <div class="border border-light overflow-y-scroll" style="max-height: 45rem;">
      ${BattleHistory(friendInfo.username, friendInfo.history)}
    </div>
      `;
    });
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

    const FriendDetailModal = ModalComponent({
      borderColor: 'pink',
      title: 'BATTLE HISTORY',
      modalId: 'friendDetailModal',
      content: '',
      buttonList: [],
    });

    return `
      ${FriendWaitModal}
      ${FriendAddModal}
      ${FriendDetailModal}
      <div class="d-md-flex justify-content-between top-0 z-1">
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

  initEvent() {
    this.initTooltip();
    this.onFriendDeleteBtnClick();
  }

  async afterRender() {
    await this.initPageData(this);
    this.onReloadButtonClick(this);
    this.onPaginationClick(this);
    this.onFriendWaitModalEvent();
    this.onFriendAddModalEvent();
    this.onFriendDetailModalEvent();
  }
}

export default Friends;
