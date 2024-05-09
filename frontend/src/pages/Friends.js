import PageComponent from '@component/PageComponent.js';
import FriendInfoCard from '@component/card/FriendInfoCard';
import FriendPageButtons from '@component/button/FriendPageButtons';
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
  }
}

export default Friends;
