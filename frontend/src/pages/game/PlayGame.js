import PageComponent from '@component/PageComponent';
import game from '@/utils/game/game';

class PlayGame extends PageComponent {
  constructor() {
    super();
    this.setTitle('Play Game');
  }

  async render() {}

  async afterRender() {
    game();
  }
}
export default PlayGame;
