import PageComponent from '@component/PageComponent.js';
import BasicButton from '@component/button/BasicButton';
import createRoomForm from '@component/form/CreateRoomForm';
import Fetch from '@/utils/Fetch';
import regex from '@/constants/Regex';
import ErrorHandler from '@/utils/ErrorHandler';
import { navigateTo } from '@/utils/router';

class CreateRoom extends PageComponent {
  constructor() {
    super();
    this.setTitle('Create Room');
    this.titleState = false;
    this.ballState = true;
    this.speedState = true;
    this.mapState = false;
    this.modeState = false;
    this.progressState = 40;
  }

  async render() {
    const createBtn = BasicButton({
      id: 'createRoomBtn',
      text: '<< Create Room >>',
      classList: 'btn btn-outline-light mt-3 fs-10',
      type: 'submit',
      form: 'createRoomForm',
      disabled: true,
    });

    return `
      <div class="container h-100 p-3 game-room-border">
        <h1 class="display-1 text-center">ROOM SETTING</h1>
        <div class="container h-75 w-100 d-flex flex-column mt-3 justify-content-between align-items-center">
          <div class="row game-setting-container h-75 w-100 mb-5 overflow-auto">
            ${createRoomForm()}
          </div>
          <div class="row h-25 w-75 pt-4">
            <div id="progressBar" class="progress h-25 p-0" role="progressbar" aria-label="Animated striped progress" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100">
              <div id="progressBarNow" class="progress-bar progress-bar-striped progress-bar-animated" style="width: 40%"></div>
            </div>
            ${createBtn}
          </div>
        </div>
      </div>
      `;
  }

  async submitGameForm(form) {
    const gameTitle = form.gameTitle.value.toLowerCase();
    const gameBall = form.gameBall.value;
    const gameSpeed = form.gameSpeed.value;
    const gameMap = [...form.mapOptions].filter(
      (option) => option.checked === true
    )[0]?.id;
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
      .then(() => {
        document.getElementById('createRoomForm').reset();
        ErrorHandler.setToast('Room created successfully');
        navigateTo(`/game/waiting?title=${gameTitle}`);
      })
      .catch((err) => {
        if (err.error === 'UNIQUE constraint failed: room.room_name') {
          ErrorHandler.setToast('Room name already exists');
          this.titleState = false;
          this.progressBar();
          const gameTitle = document.getElementById('gameTitle');
          gameTitle.focus();
          gameTitle.select();
        } else {
          ErrorHandler.setToast('Failed to create room');
        }
        console.error(err);
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
