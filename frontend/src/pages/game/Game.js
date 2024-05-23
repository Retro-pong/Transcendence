import PageComponent from '@component/PageComponent.js';
import NavLink from '@component/navigation/NavLink';

class Game extends PageComponent {
  constructor() {
    super();
    this.setTitle('Game');
  }

  async render() {
    const CreateRoomButton = NavLink({
      text: 'Create Room',
      path: '/game/create',
      classList: 'btn btn-no-outline-hover fs-15 btn-arrow',
    }).outerHTML;

    const JoinRoomButton = NavLink({
      text: 'Join Room',
      path: '/game/join',
      classList: 'btn btn-no-outline-hover fs-15 btn-arrow',
    }).outerHTML;

    return `
    <div class="d-flex flex-column justify-content-around align-items-center h-90">
      <h1 class="text-center fs-18">Get ready for the next battle!</h1>
      <div class="d-flex flex-column">
        ${CreateRoomButton}
        ${JoinRoomButton}
      </div>
    </div>
    `;
  }

  async afterRender() {
    this.onNavButtonClick();
  }
}

export default Game;
