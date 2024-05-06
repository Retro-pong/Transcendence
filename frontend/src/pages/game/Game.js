import PageComponent from '@component/PageComponent.js';

class Game extends PageComponent {
  constructor() {
    super();
    this.setTitle('Game');
  }

  async render() {
    return `
      <h1 class="text-center" style="font-size: 8rem;">Get ready for the next battle!</h1>
      <p>
        This is Game Page
      </p>
      `;
  }
}

export default Game;
