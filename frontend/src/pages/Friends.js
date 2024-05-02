import NavBar from '../component/Navbar';
import PageComponent from '../component/PageComponent';

class Friends extends PageComponent {
  constructor() {
    super();
    this.setTitle('Friends');
  }

  async render() {
    return `${NavBar()}
      <h1>Friends</h1>
      <p>
        This is Friends Page
      </p>
      <p>
        <a href="/" data-link>Main</a>
      </p>
    `;
  }
}

export default Friends;
