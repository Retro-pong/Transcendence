import NavBar from '../component/Navbar.js';
import PageComponent from '../component/PageComponent.js';

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
        <a href="/main" data-link>Main</a>
        <button id="registerBtn" class="btn btn-primary">register button</button>
      </p>
      `;
  }

  async afterRender() {
    const registerBtn = document.getElementById('registerBtn');
    console.log(registerBtn);
    if (registerBtn) {
      registerBtn.addEventListener('click', () => {
        alert('register button clicked');
      });
    }
  }
}

export default Login;
