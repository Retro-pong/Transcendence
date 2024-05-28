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
      if (this.map === 'mountain') {
        this.map = 'pixel';
      } else if (this.map === 'pixel') {
        this.map = 'horizon';
      } else {
        this.map = 'mountain';
      }
      game(this.map);
    });
  }
}
export default PlayGame;
