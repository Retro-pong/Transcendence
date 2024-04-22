// import { Button } from 'bootstrap';
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
        <div class="container py-4 px-3 mx-auto">
          <h1>Hello, Bootstrap and Vite!</h1>
          <button class="btn btn-primary">Primary button</button>
        </div>
      <p>
        <a href="/profile" data-link>profile</a>
      </p>
      `;
  }
}

export default Main;
