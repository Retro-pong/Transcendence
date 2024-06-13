import PageComponent from '@component/PageComponent';
import game from '@/utils/game/game';
import socketManager from '@/utils/SocketManager';
import TokenManager from "@/utils/TokenManager";

class PlayGame extends PageComponent {
  constructor() {
    super();
    this.setTitle('Play Game');
    const params = new URLSearchParams(document.location.search);
    this.roomId = params.get('id');
    this.settings = {
      mode: 'local',
      side: 'blue',
      ball: 0x0000ff,
      speed: 3,
      map: 'mountain',
    };
    this.gameSocket = socketManager.createSocket(`/norma_game/${this.roomId}/`);
  }

  async render() {}

  setScoreBox() {
    const scoreContainer = document.getElementById('scoreContainer');
    if (this.settings.mode === 'local') {
      const width = scoreContainer.clientWidth;
      const screenWidth = window.innerWidth;
      const screenCenterX = screenWidth / 2;
      const left = screenCenterX - width / 2;
      scoreContainer.style.left = `${left}px`;
    } else {
      scoreContainer.style.left = '0';
    }
  }

  async afterRender() {
    this.setScoreBox();

    this.gameSocket.onopen(() => {
      const message = {
        type: 'access',
        token: TokenManager.getAccessToken(),
      };
      this.gameSocket.send(JSON.stringify(message));
      console.log('game socket connected');
    });

    this.gameSocket.onmessage((e) => {
      const data = JSON.parse(e.data);
      if (e.type === 'start') {
        this.settings.mode = 'multi';
        this.settings.side = data.color;
        this.settings.ball = data.ball_color;
        this.settings.speed = data.speed;
        this.settings.map = data.map;
      }
      game(this.settings, data);
    });
    this.gameSocket.onclose((e) => {
      console.log(e);
    });
    this.gameSocket.onerror((e) => {
      console.log(e);
    });

    game(this.settings);
  }
}
export default PlayGame;
