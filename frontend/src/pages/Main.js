import PageComponent from '../component/PageComponent.js';
import NavLink from '../component/NavLink.js';

class Main extends PageComponent {
  constructor() {
    super();
    this.setTitle('RETRO PONG!');
  }

  async render() {
    // TODO: path 수정
    const StartButton = NavLink({
      text: '>> Press Start! <<',
      path: '/profile',
      classList: ['btn', 'btn-outline-light', 'fs-1'],
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
}

export default Main;
