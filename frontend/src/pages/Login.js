import PageComponent from '@component/PageComponent.js';

class Login extends PageComponent {
  constructor() {
    super();
    this.setTitle('Login');
  }

  async render() {
    return `
      <h1>Login</h1>
      <p>
        This is Login Page
      </p>
      `;
  }
}

export default Login;
