import PageComponent from '@component/PageComponent';
import game from '@/utils/game/game';
import socketManager from '@/utils/SocketManager';

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
      speed: 1,
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
    game(this.settings);
  }
}
export default PlayGame;
