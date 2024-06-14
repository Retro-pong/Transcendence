import PageComponent from '@component/PageComponent.js';
import NavLink from '@component/navigation/NavLink';
import BasicButton from '@component/button/BasicButton';
import ModalComponent from '@component/modal/ModalComponent';
import GameRoomInfo from '@component/contents/GameRoomInfo';
import { Modal } from 'bootstrap';
import Fetch from '@/utils/Fetch';
import ToastHandler from '@/utils/ToastHandler';
import Router from '@/utils/Router';

class JoinRoom extends PageComponent {
  constructor() {
    super();
    this.mode = 'normal';
    this.setTitle('Join Room');
    this.roomMap = new Map();
  }

  async getRoomList() {
    return Fetch.get(`/rooms/join/${this.mode}/`).catch(() => {
      ToastHandler.setToast('Failed to get room list');
      return [];
    });
  }

  async getPageData() {
    const roomList = await this.getRoomList();
    this.roomMap.clear();
    if (roomList.length === 0) {
      return `
      <div class="d-flex justify-content-center align-items-center h-100">
        <div class="fs-11 align-self-center"> No Rooms :( </div>
      </div>`;
    }

    const setRoomModalButton = (room) => {
      this.roomMap.set(`room${room.id}`, {
        id: room.id.toString(),
        title: room.room_name,
        map: room.game_map,
        speed: room.game_speed,
        ball: room.ball_color,
      });
      const text =
        this.mode === 'normal'
          ? `[ ${room.room_name} ]`
          : `[ ${room.room_name} ] (${room.current_players}/4)`;
      return `
        <button id="room${room.id}" type="button" class="btn btn-no-outline-hover fs-11 btn-arrow" data-bs-toggle="modal" data-bs-target="#roomInfoModal">
          ${text}
        </button>`;
    };
    return roomList.map(setRoomModalButton).join('');
  }

  onModalOpen() {
    const roomInfoModal = document.getElementById('roomInfoModal');
    roomInfoModal.addEventListener('show.bs.modal', (e) => {
      const roomId = e.relatedTarget.id;
      const roomInfo = this.roomMap.get(roomId);
      const modalBody = document.querySelector('#roomInfoModal .modal-body');
      const modalFooter = document.querySelector(
        '#roomInfoModal .modal-footer'
      );
      modalFooter.innerHTML = NavLink({
        text: '>> ENTER <<',
        path: `/game/waiting?id=${roomInfo.id}&mode=${this.mode}`,
        classList: 'btn btn-outline-light w-100 fs-12',
      }).outerHTML;
      const navBtn = document.querySelector('#roomInfoModal .modal-footer a');
      navBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        Modal.getInstance(roomInfoModal).hide();
        await Router.navigateTo(navBtn.href);
      });
      modalBody.innerHTML = GameRoomInfo(roomInfo);
    });
  }

  async render() {
    const reloadRoomBtn = BasicButton({
      id: 'reloadBtn',
      text: '> Reload',
      classList:
        'btn fs-2 position-absolute top-0 end-0 mt-2 me-2 btn-no-outline-hover',
    });
    const RoomInfoModal = ModalComponent({
      borderColor: 'pink',
      title: 'Room Info',
      modalId: 'roomInfoModal',
      content: '',
      buttonList: ['joinRoomBtn'],
    });

    return `
      ${RoomInfoModal}
      <div class="container h-100 p-3 game-room-border overflow-hidden">
        <div class="d-flex justify-content-center position-relative">
          <h1 class="display-1 text-center">[ Room List ]</h1>
          ${reloadRoomBtn}
        </div>
        <nav class="nav nav-tabs">
          <button class="col btn btn-outline-light fs-1 active" id="normalTab" data-bs-toggle="tab" type="button">Normal</button>
          <button class="col btn btn-outline-light fs-1" id="tournamentTab" data-bs-toggle="tab" type="button" >Tournament</button>
        </nav>
        <div class="d-flex flex-column h-75 justify-content-center">
          <div id="pageBody" class="tab-pane active d-flex flex-column flex-column overflow-auto h-100 my-3 px-3">
          </div>
        </div>
      </div>
      `;
  }

  async initPageData() {
    const pageBody = document.getElementById('pageBody');
    pageBody.innerHTML = await this.getPageData();
  }

  onTabClick() {
    const navTabs = document.querySelectorAll('[data-bs-toggle="tab"]');
    navTabs.forEach((tab) => {
      tab.addEventListener('click', async (e) => {
        this.mode = e.target.id === 'normalTab' ? 'normal' : 'tournament';
        await this.initPageData();
      });
    });
  }

  onReloadButtonClick() {
    const reloadBtn = document.getElementById('reloadBtn');
    reloadBtn.addEventListener('click', async () => {
      await this.initPageData();
    });
  }

  async afterRender() {
    await this.initPageData();
    this.onTabClick();
    this.onReloadButtonClick();
    this.onModalOpen();
  }
}

export default JoinRoom;
