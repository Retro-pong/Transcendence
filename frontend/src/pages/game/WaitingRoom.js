import PageComponent from '@component/PageComponent.js';
import PlayerCard from '@component/card/PlayerCard';
import BasicButton from '@component/button/BasicButton';
import OpenModalButton from '@component/button/OpenModalButton';
import ModalComponent from '@component/modal/ModalComponent';
import GameManual from '@component/contents/GameManual';

class WaitingRoom extends PageComponent {
  constructor() {
    super();
    this.setTitle('Waiting Room');
  }

  async render() {
    const params = new URLSearchParams(document.location.search);
    const TITLE = params.get('title');
    // TODO: 소켓으로 게임 방 정보 받아오기, 참가자가 아니면 홈으로 리다이렉트
    const ROLE = 'host';
    const dummyPlayers = [
      {
        id: 1,
        name: 'hyobicho',
        status: 'ready',
        role: 'host',
      },
      {
        id: 2,
        name: 'hyungjpa',
        status: 'ready',
        role: 'guest',
      },
      {
        id: 3,
        name: 'wonjilee',
        status: 'ready',
        role: 'guest',
      },
      {
        id: 4,
        name: 'subinlee',
        status: 'ready',
        role: 'guest',
      },
    ];
    const PlayerCards = dummyPlayers
      .map((player) => {
        return `
          <div class="col d-flex align-items-center justify-content-center mb-2" >
            ${PlayerCard(player)}
          </div> 
        `;
      })
      .join('');
    const StartButton = BasicButton({
      id: 'startBtn',
      text: '<< Start Game! >>',
      classList: 'btn btn-no-outline-hover fs-10',
      disabled: ROLE !== 'host',
    });
    const ManualButton = OpenModalButton({
      text: '> Manual',
      classList:
        'btn btn-no-outline-hover fs-2 position-absolute top-0 end-0 mt-2 me-2',
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
      <div class="container h-100 p-3 game-room-border">
        <div class="d-flex flex-column h-100 position-relative">
          <h1 class="display-1 text-center">Welcome to<br /> [ ${TITLE} ]</h1>
          ${ManualButton} ${GameManualModal}
          <div class="d-flex justify-content-center align-items-center h-75">
            <div class="container text-center w-100">
              <div class="row row-cols-1 row-cols-md-2 g-3">
                ${PlayerCards}
              </div>
            </div>
          </div>
          <div class="d-flex justify-content-center align-items-center h-25">
            ${StartButton}
          </div>
        </div>
      </div>
      `;
  }
}

export default WaitingRoom;
