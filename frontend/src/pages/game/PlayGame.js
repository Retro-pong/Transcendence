import PageComponent from '@component/PageComponent';
import game from '@/utils/game/game';

class PlayGame extends PageComponent {
  constructor() {
    super();
    this.setTitle('Play Game');
    this.settings = {
      type: 'local',
      ball: 0x0000ff,
      speed: 1,
      map: 'mountain',
    };
  }

  async render() {}

  setScoreBox() {
    const scoreContainer = document.getElementById('scoreContainer');
    if (this.settings.type === 'local') {
      const width = scoreContainer.offsetWidth;
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

    // test 버튼들
    document.getElementById('mapTest').addEventListener('click', (e) => {
      if (this.settings.map === 'mountain') {
        this.settings.map = 'pixel';
      } else if (this.settings.map === 'pixel') {
        this.settings.map = 'horizon';
      } else {
        this.settings.map = 'mountain';
      }
      document.getElementById('mapTestVal').innerText = this.settings.map;
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
      document.getElementById('colorTestVal').innerText = this.settings.ball;
      game(this.settings);
    });
    document.getElementById('speedTest').addEventListener('click', (e) => {
      if (this.settings.speed < 5) {
        this.settings.speed += 1;
      } else {
        this.settings.speed = 1;
      }
      document.getElementById('speedTestVal').innerText = this.settings.speed;
      game(this.settings);
    });
    document.getElementById('gameTypeTest').addEventListener('click', (e) => {
      if (this.settings.type === 'local') {
        this.settings.type = 'multi';
      } else {
        this.settings.type = 'local';
      }
      this.setScoreBox();
      game(this.settings);
    });
  }
}
export default PlayGame;
