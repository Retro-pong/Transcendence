import PageComponent from '@component/PageComponent.js';
import UserProfile from '@component/contents/UserProfile.js';

class Profile extends PageComponent {
  constructor() {
    super();
    this.setTitle('Profile');
  }

  async render() {
    return `
      <h1 class>PLAYER PROFILE</h1>
      ${UserProfile()}
      `;
  }
}

export default Profile;
