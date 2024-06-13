import PageComponent from '@component/PageComponent.js';
import PlayerCard from '@component/card/PlayerCard';
import OpenModalButton from '@component/button/OpenModalButton';
import ModalComponent from '@component/modal/ModalComponent';
import GameManual from '@component/contents/GameManual';
import SocketManager from '@/utils/SocketManager';
import Router from '@/utils/Router';
import TokenManager from '@/utils/TokenManager';

class WaitingRoom extends PageComponent {
  constructor() {
    super();
    this.setTitle('Waiting Room');
    const params = new URLSearchParams(document.location.search);
    this.roomTitle = params.get('title') || "Let's Play Pong!";
    this.roomId = params.get('id');
    this.roomMode = params.get('mode') || 'normal';
    this.roomSocket = SocketManager.createSocket(
      `/${this.roomMode}_room/${this.roomId}/`
    );
    this.players = [];
  }

  async render() {
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
        <div id="room-title" class="d-flex flex-column h-100 position-relative">
          <h1 class="fs-15 text-center">Welcome to<br />[ ${this.roomTitle} ]</h1>
          ${ManualButton} 
          <div class="d-md-flex justify-content-center align-items-center overflow-auto h-100">
            <div id="player-container" class="row row-cols-1 row-cols-md-2 g-1 w-95 h-100">
            </div>
          </div>
        </div>
      </div>
      `;
  }

  addPlayers() {
    const playerContainer = document.getElementById('player-container');
    console.log(this.players);
    playerContainer.innerHTML = this.players
      .map((player) => PlayerCard(player))
      .join('');
  }

  connectSocket() {}

  async afterRender() {
    onbeforeunload = () => {
      return 'Are you sure you want to leave?';
    };

    // TODO: 소켓으로 게임 방 정보 받아오기, 참가자가 아니면 홈으로 리다이렉트
    this.roomSocket.onopen = () => {
      const message = {
        type: 'access',
        token: TokenManager.getAccessToken(),
      };
      this.roomSocket.send(JSON.stringify(message));
      console.log('Room Socket Connected');
    };

    this.roomSocket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      switch (data.type) {
        case 'users':
          console.log(data);
          this.players = [
            {
              id: '1',
              name: data.user0,
              profileImg: data.user0_image,
              win: data.user0_win,
              lose: data.user0_lose,
            },
            {
              id: '2',
              name: data.user1,
              profileImg: data.user1_image,
              win: data.user1_win,
              lose: data.user1_lose,
            },
            {
              id: '3',
              name: data.user2,
              profileImg: data.user2_image,
              win: data.user2_win,
              lose: data.user2_lose,
            },
            {
              id: '4',
              name: data.user3,
              profileImg: data.user3_image,
              win: data.user3_win,
              lose: data.user3_lose,
            },
          ];
          this.addPlayers();
          break;
        case 'start_game':
          console.log(data);
          // navigate to game page
          this.roomSocket.close();
          Router.navigateTo(
            `/game/play?id=${this.roomId}&mode=${this.roomMode}`
          );
          break;
        case 'full':
          // navigate to join room page
          this.roomSocket.close();
          Router.navigateTo('/game/join');
          break;
        default:
          // this.roomSocket.close();
          break;
      }
      console.log(data);
    };

    this.roomSocket.onclose = (e) => {
      console.log('Room Socket Disconnected');
      console.log(e.code);
    };

    this.roomSocket.onerror = (error) => {
      // navigate to join room page
      Router.navigateTo('/game/join');
      console.error('Room Socket Error:', error);
    };
  }
}

export default WaitingRoom;
