import PageComponent from '@component/PageComponent.js';
import NavLink from '@component/navigation/NavLink';
import BasicButton from '@component/button/BasicButton';
import Fetch from '@/utils/Fetch';

class JoinRoom extends PageComponent {
  constructor() {
    super();
    this.mode = 'rumble';
    this.currPage = 1;
    this.totalPage = 1;
    this.size = 5;
    this.setTitle('Join Room');
  }

  async getRoomList() {
    const roomList =
      this.mode === 'rumble'
        ? await Fetch.get(
            `/rumbleList?_page=${this.currPage}&_limit=${this.size}`
          )
        : await Fetch.get(
            `/tournamentList?_page=${this.currPage}&_limit=${this.size}`
          );

    const totalParty = this.mode === 'rumble' ? 2 : 4;
    this.totalPage = 2; // TODO: totalPage 받아오기
    this.setPagination();

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
    const prevBtn = BasicButton({
      id: 'prevBtn',
      text: '<',
      classList: 'fs-7 btn ',
      disabled: this.currPage === 1,
    });
    const nextBtn = BasicButton({
      id: 'nextBtn',
      text: '>',
      classList: 'fs-7 btn',
      disabled: this.totalPage === this.currPage,
    });

    return `
      <div class="container h-100 p-3 game-room-border">
        <div class="d-flex justify-content-center position-relative">
          <h1 class="display-1 text-center">[ Room List ]</h1>
          ${reloadRoomBtn}
        </div>
        <nav class="nav nav-tabs">
          <button class="btn btn-outline-light fs-1 active" id="rumbleTab" data-bs-toggle="tab" type="button">Rumble</button>
          <button class="btn btn-outline-light fs-1" id="tournamentTab" data-bs-toggle="tab" type="button" >Tournament</button>
        </nav>
        <div class="d-flex flex-column h-75 justify-content-center">
          <div id="joinRoomBody" class="tab-pane active d-flex flex-column flex-column overflow-auto h-100">
            ${RoomLinks}
          </div>
          <div class="d-flex justify-content-center">
            ${prevBtn}
            <div class="fs-7 align-self-center">
              <span id="currPage">${this.currPage}</span> / <span id="totalPage">${this.totalPage}</span>
            </div>
            ${nextBtn}
          </div>
        </div>
      </div>
      `;
  }

  setPagination() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const currPage = document.getElementById('currPage');
    const totalPage = document.getElementById('totalPage');

    if (!prevBtn || !nextBtn || !currPage || !totalPage) return;

    totalPage.innerHTML = this.totalPage;
    currPage.innerHTML = this.currPage;
    if (this.currPage === 1) {
      prevBtn.setAttribute('disabled', 'true');
    } else {
      prevBtn.removeAttribute('disabled');
    }
    if (this.currPage === this.totalPage) {
      nextBtn.setAttribute('disabled', 'true');
    } else {
      nextBtn.removeAttribute('disabled');
    }
  }

  async afterRender() {
    const joinRoomBody = document.getElementById('joinRoomBody');

    // 새로고침
    const reloadRoomBtn = document.getElementById('reloadRoomBtn');
    reloadRoomBtn.addEventListener('click', async () => {
      this.currPage = 1;
      joinRoomBody.innerHTML = await this.getRoomList();
    });

    // 탭
    const rumbleTab = document.getElementById('rumbleTab');
    const tournamentTab = document.getElementById('tournamentTab');
    rumbleTab.addEventListener('click', async () => {
      this.mode = 'rumble';
      this.currPage = 1;
      joinRoomBody.innerHTML = await this.getRoomList();
    });
    tournamentTab.addEventListener('click', async () => {
      this.mode = 'tournament';
      this.currPage = 1;
      joinRoomBody.innerHTML = await this.getRoomList();
    });

    // 페이지네이션
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    prevBtn.addEventListener('click', async () => {
      if (this.currPage === 1) return;
      this.currPage -= 1;
      joinRoomBody.innerHTML = await this.getRoomList();
    });

    nextBtn.addEventListener('click', async () => {
      if (this.currPage === this.totalPage) return;
      this.currPage += 1;
      joinRoomBody.innerHTML = await this.getRoomList();
    });
  }
}

export default JoinRoom;
