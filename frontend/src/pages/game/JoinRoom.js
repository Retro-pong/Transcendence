import PageComponent from '@component/PageComponent.js';
import NavLink from '@component/navigation/NavLink';
import BasicButton from '@component/button/BasicButton';
import Fetch from '@/utils/Fetch';

class JoinRoom extends PageComponent {
  constructor() {
    super();
    this.mode = 'rumble';
    this.setTitle('Join Room');
  }

  async getRoomList() {
    const roomList =
      this.mode === 'rumble'
        ? await Fetch.get('/rumbleList')
        : await Fetch.get('/tournamentList');

    const totalParty = this.mode === 'rumble' ? 2 : 4;

    return roomList
      .map((room) => {
        return NavLink({
          text: `[ ${room.title} ] (${room.currentParty}/${totalParty})`,
          path: '/game/waiting',
          classList: 'btn btn-no-outline-hover fs-11 btn-arrow',
        }).outerHTML;
      })
      .join('');
  }

  async render() {
    const RoomLinks = await this.getRoomList();
    const reloadRoomBtn = BasicButton({
      id: 'reloadRoomBtn',
      text: '> Reload',
      classList:
        'fs-2 position-absolute top-0 end-0 mt-2 me-2 btn-no-outline-hover',
    });
    return `
      <div class="container h-100 p-3 game-room-border">
        <div class="d-flex justify-content-center position-relative">
          <h1 class="display-1 text-center">[ Room List ]</h1>
          ${reloadRoomBtn}
        </div>
        <nav class="nav nav-tabs">
          <button class="btn btn-outline-light fs-1 active" id="rumble-tab" data-bs-toggle="tab" type="button">Rumble</button>
          <button class="btn btn-outline-light fs-1" id="tournament-tab" data-bs-toggle="tab" type="button" >Tournament</button>
        </nav>
        <div class="d-flex justify-content-center overflow-auto" style="height: 70%;">
          <div id="joinRoomBody" class="tab-pane active d-flex flex-column">
            ${RoomLinks}
          </div>
        </div>
        <div class="d-flex justify-content-center">
          >> 1 / 3 <<
        </div>
      </div>
      `;
  }

  async afterRender() {
    const reloadRoomBtn = document.getElementById('reloadRoomBtn');
    const joinRoomBody = document.getElementById('joinRoomBody');

    reloadRoomBtn.addEventListener('click', async () => {
      joinRoomBody.innerHTML = await this.getRoomList();
    });

    const rumbleTab = document.getElementById('rumble-tab');
    const tournamentTab = document.getElementById('tournament-tab');

    rumbleTab.addEventListener('click', async () => {
      this.mode = 'rumble';
      joinRoomBody.innerHTML = await this.getRoomList();
    });

    tournamentTab.addEventListener('click', async () => {
      this.mode = 'tournament';
      joinRoomBody.innerHTML = await this.getRoomList();
    });
  }
}

export default JoinRoom;
