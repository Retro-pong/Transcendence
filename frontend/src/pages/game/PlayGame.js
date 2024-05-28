import PageComponent from '@component/PageComponent';
import game from '@/utils/game/game';

class PlayGame extends PageComponent {
  constructor() {
    super();
    this.setTitle('Play Game');
    this.settings = {
      ball: 0x0000ff,
      speed: 1,
      map: 'mountain',
    };
  }

  async render() {}

  async afterRender() {
    game(this.settings);

    document.getElementById('mapTest').addEventListener('click', (e) => {
      if (this.settings.map === 'mountain') {
        this.settings.map = 'pixel';
      } else if (this.settings.map === 'pixel') {
        this.settings.map = 'horizon';
      } else {
        this.settings.map = 'mountain';
      }
      game(this.settings);
    });

    document.getElementById('colorTest').addEventListener('click', (e) => {
      if (this.settings.ball === 0x0000ff) {
        this.settings.ball = 0xff0000;
      } else if (this.settings.ball === 0xff0000) {
        this.settings.ball = 0x00ff00;
      } else {
        this.settings.ball = 0x0000ff;
      }
      game(this.settings);
    });
    document.getElementById('speedTest').addEventListener('click', (e) => {
      if (this.settings.speed < 5) {
        this.settings.speed += 1;
      } else {
        this.settings.speed = 1;
      }
      game(this.settings);
    });
  }
}
export default PlayGame;
