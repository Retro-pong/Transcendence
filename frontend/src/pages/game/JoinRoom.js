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
          disabled: false,
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
        <div class="d-flex justify-content-center h-75 overflow-auto">
          <div id="joinRoomBody" class="d-flex flex-column">
            ${RoomLinks}
          </div>
        </div>
        <div class="d-flex justify-content-center">
          pagination
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
  }
}

export default JoinRoom;
