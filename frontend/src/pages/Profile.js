import NavBar from '@component/Navbar.js';
import PageComponent from '@component/PageComponent.js';

class Profile extends PageComponent {
  constructor() {
    super();
    this.setTitle('Profile');
  }

  async render() {
    return `${NavBar()}
      <h1>Profile</h1>
      <p>
        This is Profile Page
      </p>
      <p>
        <a href="/" data-link>Main</a>
      </p>
      `;
  }
}

export default Profile;
