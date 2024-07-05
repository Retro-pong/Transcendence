import PageComponent from '@component/PageComponent.js';
import BasicButton from '@component/button/BasicButton';
import createRoomForm from '@component/form/CreateRoomForm';
import Fetch from '@/utils/Fetch';
import regex from '@/constants/Regex';
import ToastHandler from '@/utils/ToastHandler';
import Router from '@/utils/Router';

class CreateRoom extends PageComponent {
  constructor() {
    super();
    this.setTitle('Create Room');
    this.titleState = true;
    this.ballState = true;
    this.speedState = true;
    this.mapState = true;
    this.modeState = true;
    this.progressState = 100;
  }

  async render() {
    const createBtn = BasicButton({
      id: 'createRoomBtn',
      text: '<< Create Room >>',
      classList: 'btn btn-outline-light mt-3 fs-10',
      type: 'submit',
      form: 'createRoomForm',
    });

    return `
      <div class="container position-relative h-100 p-3 game-room-border">
        <div class="position-absolute">
          <button id="backBtn" class="btn btn-no-outline-hover fs-2"><< Back</button>
        </div>
        <h1 class="fs-15 text-center">ROOM SETTING</h1>
        <div class="container h-75 w-100 d-flex flex-column mt-3 justify-content-between align-items-center">
          <div class="row game-setting-container h-75 w-100 mb-4 overflow-y-scroll">
            ${createRoomForm()}
          </div>
          <div class="row h-25 w-75 pt-4">
            <div id="progressBar" class="progress h-25 p-0" role="progressbar" aria-label="Animated striped progress" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">
              <div id="progressBarNow" class="progress-bar progress-bar-striped progress-bar-animated" style="width: 100%"></div>
            </div>
            ${createBtn}
          </div>
        </div>
      </div>
      `;
  }

  handleBackBtnClick() {
    const backBtn = document.getElementById('backBtn');
    backBtn.addEventListener('click', () => {
      history.back();
    });
  }

  async submitGameForm(form) {
    const gameTitle = form.gameTitle.value.toLowerCase();
    const gameBall = form.gameBall.value;
    const gameSpeed = form.gameSpeed.value;
    const gameMap = [...form.mapOptions].filter(
      (option) => option.checked === true
    )[0]?.dataset.map;
    const gameMode = [...form.modeOptions].filter(
      (option) => option.checked === true
    )[0]?.id;

    await Fetch.post('/rooms/create/', {
      room_name: gameTitle,
      game_ball: gameBall,
      game_speed: gameSpeed,
      game_map: gameMap,
      game_mode: gameMode,
    })
      .then((res) => {
        const roomId = res.id.toString();
        document.getElementById('createRoomForm').reset();
        ToastHandler.setToast('Room created successfully');
        Router.replaceState('/game/join');
        Router.navigateTo(`/game/waiting?id=${roomId}&mode=${gameMode}`);
      })
      .catch((err) => {
        if (err.message === 'UNIQUE constraint failed: room.room_name') {
          ToastHandler.setToast('Room name already exists');
          this.titleState = false;
          this.progressBar();
          const gameTitle = document.getElementById('gameTitle');
          gameTitle.focus();
          gameTitle.select();
        } else {
          ToastHandler.setToast('Failed to create room');
        }
      });
  }

  progressBar() {
    this.progressState =
      (this.titleState +
        this.ballState +
        this.speedState +
        this.mapState +
        this.modeState) *
      20;
    document.getElementById('progressBarNow').style.width =
      `${this.progressState}%`;
    document.getElementById('createRoomBtn').disabled =
      this.progressState !== 100;
    document
      .getElementById('progressBar')
      .setAttribute('aria-valuenow', this.progressState);
  }

  addInputEvents() {
    document.getElementById('gameBall').addEventListener('input', (e) => {
      document.getElementById('gameBallValue').innerText = e.target.value;
    });
    document.getElementById('gameSpeed').addEventListener('input', (e) => {
      document.getElementById('gameSpeedValue').innerText = e.target.value;
    });
    document.getElementById('gameTitle').addEventListener('input', (e) => {
      e.preventDefault();
      this.titleState =
        e.target.value !== '' && regex.gameTitle.test(e.target.value);
      this.progressBar();
    });
    document.getElementsByName('mapOptions').forEach((option) => {
      option.addEventListener('input', () => {
        this.mapState = true;
        this.progressBar();
      });
    });
    document.getElementsByName('modeOptions').forEach((option) => {
      option.addEventListener('input', () => {
        this.modeState = true;
        this.progressBar();
      });
    });
  }

  async afterRender() {
    this.handleBackBtnClick();
    document
      .getElementById('createRoomForm')
      .addEventListener('submit', (e) => {
        e.preventDefault();
        this.submitGameForm(e.target.elements);
      });
    this.addInputEvents();
  }
}

export default CreateRoom;
