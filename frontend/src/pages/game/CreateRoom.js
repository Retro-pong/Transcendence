import PageComponent from '@component/PageComponent.js';
import BasicButton from '@component/button/BasicButton';
import createRoomForm from '@component/form/CreateRoomForm';
import { Toast } from 'bootstrap';
import Fetch from '@/utils/Fetch';
import regex from '@/constants/Regex';

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
      classList: 'btn btn-outline-light fs-10',
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
    const gameTitle = form.gameTitle.value;
    const gameBall = form.gameBall.value;
    const gameSpeed = form.gameSpeed.value;
    const gameMap = [...form.mapOptions].filter(
      (option) => option.checked === true
    )[0]?.id;
    const gameMode = [...form.modeOptions].filter(
      (option) => option.checked === true
    )[0]?.id;
    const toastMessage = document.getElementById('toast-message');
    const toast = Toast.getOrCreateInstance('#toast');

    await Fetch.post('/game/room', {
      gameTitle,
      gameBall,
      gameSpeed,
      gameMap,
      gameMode,
    })
      .then(() => {
        document.getElementById('createRoomForm').reset();
        toastMessage.innerText = 'Room created successfully';
        toast.show();
        // TODO: navigate to the created room
      })
      .catch((err) => {
        toastMessage.innerText = 'Failed to create room';
        toast.show();
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
