import PageComponent from '@component/PageComponent.js';
import NavLink from '@component/navigation/NavLink.js';
import TokenManager from '@/utils/TokenManager';

class Home extends PageComponent {
  constructor() {
    super();
    this.setTitle('RETRO PONG!');
  }

  async render() {
    // TODO: path 수정
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
          <buțton id="reissueBtn" class="btn btn-outline-light fs-13">> 토큰 재발급 테스트 <</button>
        </div>
      </div>
      `;
  }

  async afterRender() {
    // 토큰 재발급 테스트용 코드
    document
      .getElementById('reissueBtn')
      .addEventListener('click', async () => {
        await TokenManager.reissueAccessToken();
      });
    await this.onNavButtonClick();
  }
}

export default Home;
