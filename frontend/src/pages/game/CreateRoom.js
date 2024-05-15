import PageComponent from '@component/PageComponent.js';
import BasicButton from '@component/button/BasicButton';
import createRoomForm from '@component/form/CreateRoomForm';
import Fetch from '@/utils/Fetch';
import {Toast} from "bootstrap";

class CreateRoom extends PageComponent {
  constructor() {
    super();
    this.setTitle('Create Room');
  }

  async render() {
    const createBtn = BasicButton({
      id: 'createRoomBtn',
      text: '<< Create Room >>',
      classList: 'btn btn-outline-light fs-10',
      type: 'submit',
      form: 'createRoomForm',
    });

    return `
      <div class="container h-100 p-3 game-room-border">
        <h1 class="display-1 text-center">ROOM SETTING</h1>
        <div class="container h-75 w-100 d-flex flex-column mt-3 bg-dark justify-content-between align-items-center">
          <div class="row h-75 w-100 overflow-auto">
            ${createRoomForm()}
          </div>
          <div class="row h-25 w-75 p-0">${createBtn}</div>
        </div>
      </div>
      `;
  }

  async submitGameForm(form) {
    const gameTitle = form.gameTitle.value;
    const gameColor = form.gameColor.value;
    const gameMode = [...form.modeOptions].filter(
      (option) => option.checked === true
    )[0]?.id;
    const toastMessage = document.getElementById('toast-message');
    const toast = Toast.getOrCreateInstance('#toast');
    console.log(gameTitle, gameColor, gameMode);

    if (gameTitle === '') {
      toastMessage.innerText = 'Please enter the title';
      toast.show();
      return;
    }
    if (gameMode === undefined) {
      toastMessage.innerText = 'Please select the mode';
      toast.show();
      return;
    }

    await Fetch.post('/game/room', { gameTitle, gameColor, gameMode })
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

  async afterRender() {
    document
      .getElementById('createRoomForm')
      .addEventListener('submit', (e) => {
        e.preventDefault();
        this.submitGameForm(e.target.elements);
      });
    document.getElementById('gameColor').addEventListener('input', (e) => {
      document.getElementById('gameColorValue').innerText = e.target.value;
    });
  }
}

export default CreateRoom;
