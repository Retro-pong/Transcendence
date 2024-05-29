import PageComponent from '@component/PageComponent';
import multiGame from "@/utils/game/multiGame";

class PlayGame extends PageComponent {
  constructor() {
    super();
    this.setTitle('Play Game');
    this.settings = {
      type: 'multi',
      ball: 0x0000ff,
      speed: 1,
      map: 'mountain',
    };
  }

  async render() {}

  async afterRender() {
    if (this.settings.type === 'local') {
      document.getElementById('gameCanvasLocalOne').classList.remove('d-none');
      document.getElementById('gameCanvasLocalTwo').classList.remove('d-none');
    }
    if (this.settings.type === 'multi') {
      document.getElementById('gameCanvasMulti').classList.remove('d-none');
    }

    multiGame(this.settings);

    document.getElementById('mapTest').addEventListener('click', (e) => {
      if (this.settings.map === 'mountain') {
        this.settings.map = 'pixel';
      } else if (this.settings.map === 'pixel') {
        this.settings.map = 'horizon';
      } else {
        this.settings.map = 'mountain';
      }
      document.getElementById('mapTestVal').innerText = this.settings.map;
      multiGame(this.settings);
    });

    document.getElementById('colorTest').addEventListener('click', (e) => {
      if (this.settings.ball === 0x0000ff) {
        this.settings.ball = 0xff0000;
      } else if (this.settings.ball === 0xff0000) {
        this.settings.ball = 0x00ff00;
      } else {
        this.settings.ball = 0x0000ff;
      }
      document.getElementById('colorTestVal').innerText = this.settings.ball;
      multiGame(this.settings);
    });
    document.getElementById('speedTest').addEventListener('click', (e) => {
      if (this.settings.speed < 5) {
        this.settings.speed += 1;
      } else {
        this.settings.speed = 1;
      }
      document.getElementById('speedTestVal').innerText = this.settings.speed;
      multiGame(this.settings);
    });
  }
}
export default PlayGame;
