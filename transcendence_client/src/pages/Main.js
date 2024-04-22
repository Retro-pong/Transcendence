import NavBar from '../component/Navbar.js';
import PageComponent from '../component/PageComponent.js';

class Main extends PageComponent {
  constructor() {
    super();
    this.setTitle('Main');
  }

  async render() {
    return `${NavBar()}
      <h1>Main</h1>
      <p>
        This is Main Page
      </p>
      <p>
        <a href="/profile" data-link>profile</a>
      </p>
      `;
  }
}

export default Main;
