import PageComponent from '@component/PageComponent.js';
import NavLink from '@component/navigation/NavLink';
import OpenModalButton from '@component/button/OpenModalButton';
import ModalComponent from '@component/modal/ModalComponent';
import GameManual from '@component/contents/GameManual';

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

    const LocalPlayButton = NavLink({
      text: 'Local Play',
      path: '/game/play',
      classList: 'btn btn-no-outline-hover fs-15 btn-arrow',
    }).outerHTML;

    const ManualButton = OpenModalButton({
      text: '[ How To Play ]',
      classList: 'btn btn-no-outline-hover fs-10 manualBtn',
      modalId: '#gameManualModal',
    });

    const GameManualModal = ModalComponent({
      borderColor: 'mint',
      title: 'How To Play',
      modalId: 'gameManualModal',
      content: GameManual(),
      buttonList: [],
    });

    return `
    ${GameManualModal}
    <div class="d-flex flex-column justify-content-around align-items-center h-90">
      <h1 class="text-center fs-18">Get ready for the next battle!</h1>
      <div class="d-flex flex-column">
        ${ManualButton}
        ${CreateRoomButton}
        ${JoinRoomButton}
        ${LocalPlayButton}
      </div>
    </div>
    `;
  }

  async afterRender() {
    this.onNavButtonClick();
  }
}

export default Game;
