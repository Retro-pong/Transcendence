import NavBar from '../component/Navbar.js';
import PageComponent from '../component/PageComponent.js';
import RegisterForm from '../component/RegisterForm.js';
import OpenModalButton from '../component/button/OpenModalButton.js';
import ModalComponent from '../component/modal/ModalComponent.js';

class Login extends PageComponent {
  constructor() {
    super();
    this.setTitle('Login');
  }

  async render() {
    return `${NavBar()}
      ${OpenModalButton({ text: '> Register <', classList: 'btn btn-no-outline-hover', modalId: '#registerModal' })}
      ${ModalComponent({ title: 'WELCOME!', modalId: 'registerModal', content: RegisterForm(), buttons: ['<button type="button" class="btn btn-primary">Register</button>'] })}
      `;
  }
}

export default Login;
