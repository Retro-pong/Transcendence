import PageComponent from '@component/PageComponent.js';
import NavLink from '@component/navigation/NavLink';
import Fetch from '@/utils/Fetch';
// import BasicButton from '@component/button/BasicButton';

class JoinRoom extends PageComponent {
  constructor() {
    super();
    this.setTitle('Join Room');
  }

  async getRoomList() {
    return Fetch.get('/roomList');
  }

  async render() {
    const roomList = await this.getRoomList();
    const RoomLinks = roomList
      .map((room) => {
        return NavLink({
          text: `[ ${room.title} ] (${room.currentParty}/${room.totalParty})`,
          path: '/game', // path: `/game/room/${room.id}`,
          classList: 'btn btn-no-outline-hover fs-11 btn-arrow',
          disabled: false,
        }).outerHTML;
      })
      .join('');
    return `
      <div class="container h-100 p-3 game-room-border">
        <h1 class="display-1 text-center">[ Room List ]</h1>
        <div class="d-flex justify-content-center h-75 overflow-auto">
          <div class="d-flex flex-column">
            ${RoomLinks}
          </div>
        </div>
        <div class="d-flex justify-content-center">
          pagination
        </div>
      </div>
      `;
  }
}

export default JoinRoom;
