import PageComponent from '@component/PageComponent.js';
import NavLink from '@component/navigation/NavLink';
import Fetch from '@/utils/Fetch';

class JoinRoom extends PageComponent {
  constructor() {
    super();
    this.setTitle('Join Room');
  }

  async getRoomLinks() {
    const roomList = await Fetch.get('/roomList');

    return roomList
      .map((room) => {
        return NavLink({
          text: `[ ${room.title} ] (${room.currentParty}/${room.totalParty})`,
          path: '/game/waiting',
          classList: 'btn btn-no-outline-hover fs-11 btn-arrow',
          disabled: false,
        }).outerHTML;
      })
      .join('');
  }

  async render() {
    const RoomLinks = await this.getRoomLinks();

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
