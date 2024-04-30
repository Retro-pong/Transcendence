import NavBar from '@component/Navbar.js';
import PageComponent from '@component/PageComponent.js';

class Login extends PageComponent {
  constructor() {
    super();
    this.setTitle('Login');
  }

  async render() {
    return `${NavBar()}
      <h1>Login</h1>
      <p>
        This is Login Page
      </p>
      <p>
        <a href="/" data-link>Home</a>
      </p>
      `;
  }
}

export default Login;
