import PageComponent from '@component/PageComponent.js';

class Profile extends PageComponent {
  constructor() {
    super();
    this.setTitle('Profile');
  }

  async render() {
    return `
      <h1>Profile</h1>
      <p>
        This is Profile Page
      </p>
      `;
  }
}

export default Profile;
