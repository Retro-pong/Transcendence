import PageComponent from '@component/PageComponent';
import ModalComponent from '@component/modal/ModalComponent';
import { Modal } from 'bootstrap';
import socketManager from '@/utils/SocketManager';
import TokenManager from '@/utils/TokenManager';
import GameManager from '@/utils/game/GameManager';
import Router from '@/utils/Router';
import ToastHandler from '@/utils/ToastHandler';

class PlayGame extends PageComponent {
  constructor() {
    super();
    this.setTitle('Play Game');
    const params = new URLSearchParams(document.location.search);
    this.gameId = params.get('id');
    this.gameMode = params.get('mode');
    socketManager.gameSocket = this.gameMode
      ? socketManager.createSocket(`/${this.gameMode}_game/${this.gameId}/`)
      : null;
    this.gameManger = null;
    this.side = '';
    this.blueScore = '';
    this.redScore = '';
  }

  async render() {
    const gameResultModal = ModalComponent({
      borderColor: 'pink',
      title: 'Game Result',
      modalId: 'gameResultModal',
      content: `
        <div class="d-flex flex-column justify-content-center align-items-center h-50">
          <div id="gameResult" class="fs-15"></div>
          <div class="w-75 d-flex justify-content-around align-items-center fs-12">
            <div id="redScore" class="text-danger"></div>
            <div id="blueScore" class="text-primary"></div>
          </div>
        </div>
      `,
      buttonList: ['gameResultBtn'],
    });
    return `${gameResultModal}`;
  }

  async afterRender() {
    const gameResultModal = Modal.getOrCreateInstance('#gameResultModal');
    const modalCloseBtn = document.querySelector('#gameResultBtn');
    const gameResult = document.querySelector('#gameResult');
    const redScore = document.querySelector('#redScore');
    const blueScore = document.querySelector('#blueScore');

    modalCloseBtn.addEventListener('click', async () => {
      gameResultModal.hide();
      await Router.navigateTo('/game');
    });

    this.gameManger = new GameManager();
    // local game
    if (!this.gameMode) {
      this.gameManger.localGameSetting();
      this.gameManger.localGameStart();
    }
    // multi game
    else {
      socketManager.gameSocket.onopen = () => {
        const message = {
          type: 'access',
          token: TokenManager.getAccessToken(),
        };
        socketManager.gameSocket.send(JSON.stringify(message));
      };
      socketManager.gameSocket.onmessage = (e) => {
        const data = JSON.parse(e.data);
        console.log('multi', data);
        switch (data.type) {
          case 'start':
            this.side = data.color;
            this.gameManger.multiGameSetting(data);
            this.gameManger.multiGameStart();
            setTimeout(() => {
              socketManager.gameSocket.send(JSON.stringify({ type: 'ready' }));
            }, 3000);
            break;
          case 'render':
            this.redScore = data.redScore;
            this.blueScore = data.blueScore;
            this.gameManger.multiGameUpdateObjects(data);
            break;
          case 'result':
            socketManager.gameSocket.close(1000, 'Game End');
            break;
          default:
            break;
        }
      };
      socketManager.gameSocket.onclose = () => {
        redScore.innerText = `${this.redScore}`;
        blueScore.innerText = `${this.blueScore}`;
        const winner = this.redScore > this.blueScore ? 'red' : 'blue';
        gameResult.innerText = this.side === winner ? 'You Win!' : 'You Lose!';
        gameResult.classList.add(
          this.side === 'red' ? 'text-danger' : 'text-primary'
        );
        gameResultModal.show();
      };
      socketManager.gameSocket.onerror = async () => {
        ToastHandler.setToast('Game Error! Please try again later');
        await Router.navigateTo('/game');
      };
    }
  }
}
export default PlayGame;
