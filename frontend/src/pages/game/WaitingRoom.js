import PageComponent from '@component/PageComponent.js';
import PlayerCard from '@component/card/PlayerCard';
import SocketManager from '@/utils/SocketManager';
import Router from '@/utils/Router';
import ToastHandler from '@/utils/ToastHandler';

class WaitingRoom extends PageComponent {
  constructor() {
    super();
    this.setTitle('Waiting Room');
    const params = new URLSearchParams(document.location.search);
    this.roomTitle = '';
    this.roomMode = params.get('mode');
    this.players =
      this.roomMode === 'normal'
        ? [{ id: 1 }, { id: 2 }]
        : [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
  }

  async render() {
    return `
      <div class="container h-100 p-3 game-room-border">
        <div class="d-flex flex-column h-100 position-relative">
          <div class="position-absolute top-0 start-0">
            <button id="backBtn" class="btn btn-no-outline-hover fs-2"><< Back</button>
          </div>
          <h1 id="room-title" class="fs-15 text-center">Welcome to<br />[ ${this.roomTitle} ]</h1>
          <div class="container overflow-auto h-100">
            <div id="player-container" class="row row-cols-1 row-cols-md-2 g-1">
              ${this.players.map((player) => PlayerCard(player)).join('')}
            </div>
          </div>
        </div>
      </div>
      `;
  }

  addRoomTitle() {
    if (!this.roomTitle) return;
    const roomTitle = document.getElementById('room-title');
    roomTitle.innerHTML = `Welcome to<br />[ ${this.roomTitle} ]`;
  }

  addPlayers() {
    this.players.forEach((player) => {
      const playerId = document.getElementById(`player${player.id}-id`);
      const playerName = document.getElementById(`player${player.id}-name`);
      const playerScore = document.getElementById(`player${player.id}-score`);
      const playerImg = document.getElementById(`player${player.id}-img`);
      playerId.innerHTML = `Player ${player.id}`;
      playerName.innerHTML = player.name || 'waiting...';
      playerScore.innerHTML = player.name
        ? `${player.win}W/${player.lose}L`
        : '...';
      playerImg.innerHTML = player.profileImg
        ? `<img src="${player.profileImg}" onerror="this.src='/img/profile_fallback.jpg';" class="img-fluid" alt="profile" style="object-fit: cover;" />`
        : '';
    });
  }

  makePlayerList(data) {
    const playerCount = this.roomMode === 'normal' ? 2 : 4;
    const players = [];
    for (let i = 0; i < playerCount; i += 1) {
      players.push({
        id: i + 1,
        name: data[`user${i}`],
        profileImg: data[`user${i}_image`],
        win: data[`user${i}_win`],
        lose: data[`user${i}_lose`],
      });
    }
    this.players = players;
  }

  handleBackBtnClick() {
    const backBtn = document.getElementById('backBtn');
    backBtn.addEventListener(
      'click',
      async () => {
        window.removeEventListener('popstate', SocketManager.popstateEvent);
        ToastHandler.setToast('You left the room');
        SocketManager.roomSocket.close();
        history.back();
      },
      { once: true }
    );
  }

  async afterRender() {
    this.handleBackBtnClick();
    SocketManager.roomSocket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      this.roomTitle = data.room_name;
      this.addRoomTitle();

      switch (data.type) {
        case 'users':
          this.makePlayerList(data);
          this.addPlayers();
          break;
        case 'start_game':
          SocketManager.roomSocket.close();
          Router.replaceState('/game');
          if (this.roomMode === 'normal') {
            Router.navigateTo(
              `/game/play?id=${data.room_id}&mode=${this.roomMode}`
            );
          } else {
            Router.navigateTo(
              `/game/play?semi_1=${data.room_id_semi_1}&semi_2=${data.room_id_semi_2}&final=${data.room_id_final}&mode=semi-final`
            );
          }
          break;
        case 'error':
          ToastHandler.setToast(data.message);
          SocketManager.roomSocket.close();
          history.back();
          break;
        default:
          break;
      }
    };
  }
}

export default WaitingRoom;
