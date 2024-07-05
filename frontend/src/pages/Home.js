import PageComponent from '@component/PageComponent.js';
import NavLink from '@component/navigation/NavLink.js';

class Home extends PageComponent {
  constructor() {
    super();
    this.setTitle('RETRO PONG!');
  }

  async render() {
    const StartButton = NavLink({
      text: '>> Press Start! <<',
      path: '/game',
      classList: 'btn btn-outline-light fs-13',
    }).outerHTML;

    return `
      <div class="d-grid gap-4">
        <div class="row py-4">
          <h1 class="text-center title">PONG!</h1>
        </div>
        <div class="row py-4">
          ${StartButton}
        </div>
      </div>
      `;
  }

  async afterRender() {
    this.onNavButtonClick();
  }
}

export default Home;
