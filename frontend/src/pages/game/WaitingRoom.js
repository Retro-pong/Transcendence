import PageComponent from '@component/PageComponent.js';
import PlayerCard from '@component/card/PlayerCard';
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
    const TITLE = params.get('title') || 'Game Room';
    // TODO: 소켓으로 게임 방 정보 받아오기, 참가자가 아니면 홈으로 리다이렉트
    const dummyPlayers = [
      {
        id: 1,
        name: 'hyobicho',
        profileImg:
          'https://www.blueconomy.co.kr/news/photo/202402/2399_3001_921.png',
        win: 5,
        lose: 0,
      },
      {
        id: 2,
        name: 'hyungjpa',
        profileImg:
          'https://www.blueconomy.co.kr/news/photo/202402/2399_3001_921.png',
        win: 3,
        lose: 2,
      },
      {
        id: 3,
        name: 'wonjilee',
        profileImg:
          'https://www.blueconomy.co.kr/news/photo/202402/2399_3001_921.png',
        win: 2,
        lose: 3,
      },
      {
        id: 4,
        name: 'subinlee',
        profileImg:
          'https://www.blueconomy.co.kr/news/photo/202402/2399_3001_921.png',
        win: 0,
        lose: 5,
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
    const ManualButton = OpenModalButton({
      text: '> Manual',
      classList:
        'btn btn-no-outline-hover fs-2 position-absolute top-0 end-0 mt-2 me-2 d-none d-md-block',
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
      <div class="container h-100 p-3 game-room-border">
        <div class="d-flex flex-column h-100 position-relative">
          <h1 class="fs-17 text-center">Welcome to<br />[ ${TITLE} ]</h1>
          ${ManualButton} 
          <div class="d-flex justify-content-center align-items-center">
            <div class="container text-center w-100">
              <div class="row row-cols-1 row-cols-md-2 g-3">
                ${PlayerCards}
              </div>
            </div>
          </div>
        </div>
      </div>
      `;
  }
}

export default WaitingRoom;
