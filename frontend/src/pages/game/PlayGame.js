import PageComponent from '@component/PageComponent';
import socketManager from '@/utils/SocketManager';
import TokenManager from '@/utils/TokenManager';
import GameManager from '@/utils/game/GameManager';
import Router from '@/utils/Router';

class PlayGame extends PageComponent {
  constructor() {
    super();
    this.setTitle('Play Game');
    const params = new URLSearchParams(document.location.search);
    this.gameId = params.get('id');
    this.gameMode = params.get('mode');
    socketManager.gameSocket = socketManager.createSocket(
      `/${this.gameMode}_game/${this.gameId}/`
    );
    this.gameManger = null;
  }

  async render() {
    return `    
      <div id="gameCanvasContainer" class="position-relative h-100 w-100 d-none">
        <canvas id="gameCanvas" tabindex="0" class="h-100 w-100"></canvas>
      </div>
      <div id="scoreContainer"
           class="position-absolute top-0 start-50 translate-middle-x w-40 px-3 text-white d-flex flex-column align-items-center border border-5 rounded">
        <span class="fs-10">score</span>
        <div class="d-flex w-100 fs-8">
          <span id="player1Score" class="w-50 d-flex justify-content-center text-danger" data-score="0">0</span>
          <span id="player2Score" class="w-50 d-flex justify-content-center text-primary" data-score="0">0</span>
        </div>
      </div>
    `;
  }

  async afterRender() {
    this.gameManger = new GameManager();
    // local game
    if (!this.gameMode) {
      this.gameManger.localGameSetting();
      this.gameManger.localGameStart();
    }
    // multi game
    else {
      socketManager.gameSocket.onopen = () => {
        const message = {
          type: 'access',
          token: TokenManager.getAccessToken(),
        };
        socketManager.gameSocket.send(JSON.stringify(message));
      };
      socketManager.gameSocket.onmessage = (e) => {
        const data = JSON.parse(e.data);
        switch (data.type) {
          case 'start':
            this.gameManger.multiGameSetting(data);
            this.gameManger.multiGameStart();
            setTimeout(() => {
              socketManager.gameSocket.send(JSON.stringify({ type: 'ready' }));
            }, 3000);
            break;
          case 'render':
            this.gameManger.multiGameUpdateObjects(data);
            break;
          case 'result':
            socketManager.gameSocket.close({ code: 1000, reason: 'game end' });
            Router.navigateTo('/game/');
            break;
          default:
            Router.navigateTo('/game/');
            break;
        }
      };
      socketManager.gameSocket.onclose = (e) => {
        // Router.navigateTo('/game/');
        console.log(e);
      };
      socketManager.gameSocket.onerror = (e) => {
        // Router.navigateTo('/game/');
        console.log(e);
      };
    }
  }
}
export default PlayGame;
