import PageComponent from '@component/PageComponent.js';
import FriendInfoCard from '@component/card/FriendInfoCard';

class Friends extends PageComponent {
  constructor() {
    super();
    this.setTitle('Friends');
  }

  async render() {
    return `
      <h1>Friends</h1>
      ${FriendInfoCard()}
      `;
  }
}

export default Friends;
