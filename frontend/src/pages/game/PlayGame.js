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
    socketManager.gameSocket = this.gameMode
      ? socketManager.createSocket(`/${this.gameMode}_game/${this.gameId}/`)
      : null;
    this.gameManger = null;
  }

  async render() {}

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
        console.log('multi', data);
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
            socketManager.gameSocket.close(1000, 'game end');
            // Router.navigateTo('/game/');
            break;
          default:
            // Router.navigateTo('/game/');
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
