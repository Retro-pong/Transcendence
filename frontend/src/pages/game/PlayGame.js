import PageComponent from '@component/PageComponent';
import ModalComponent from '@component/modal/ModalComponent';
import { Modal } from 'bootstrap';
import SocketManager from '@/utils/SocketManager';
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
    SocketManager.gameSocket = this.gameMode
      ? SocketManager.createSocket(`/${this.gameMode}_game/${this.gameId}/`)
      : null;
    this.gameManger = null;
    this.side = '';
    this.blueScore = '';
    this.redScore = '';
    this.gameStart = false;
    this.gameEnd = false;
    this.gameError = false;
    document.getElementById('gameStartBtn').innerText = 'Click Start !';
    document.getElementById('player1Score').innerText = '0';
    document.getElementById('player2Score').innerText = '0';
  }

  getGameManager() {
    return this.gameManger;
  }

  setDisposeAll() {
    this.gameManger.disposeAll();
    this.gameManger = null;
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
    const gameResultModalElement = document.querySelector('#gameResultModal');
    const modalCloseBtn = document.querySelector('#gameResultBtn');
    const gameResult = document.querySelector('#gameResult');
    const redScore = document.querySelector('#redScore');
    const blueScore = document.querySelector('#blueScore');
    const gameStartBtn = document.querySelector('#gameStartBtn');

    modalCloseBtn.addEventListener('click', async () => {
      gameResultModal.hide();
    });

    gameResultModalElement.addEventListener('hidden.bs.modal', async () => {
      redScore.innerText = '';
      blueScore.innerText = '';
      await Router.navigateTo('/game');
    });

    gameStartBtn.addEventListener('click', () => {
      gameStartBtn.innerText = 'Waiting for opponent...';
      gameStartBtn.disabled = true;
      SocketManager.gameSocket.send(JSON.stringify({ type: 'ready' }));
    });

    this.gameManger = new GameManager();
    // local game
    if (!this.gameMode) {
      this.gameManger.localGameSetting();
      this.gameManger.localGameStart();
    }
    // multi game
    else {
      SocketManager.gameSocket.onopen = () => {
        const message = {
          type: 'access',
          token: TokenManager.getAccessToken(),
        };
        SocketManager.gameSocket.send(JSON.stringify(message));
      };
      SocketManager.gameSocket.onmessage = (e) => {
        const data = JSON.parse(e.data);
        // 방이 다 찬 경우 or 새로고침해서 소켓 끊었다가 다시 연결한 경우
        if (data.error === 'Game is full.') {
          this.gameError = true;
          SocketManager.gameSocket.close(1000, 'Game Full');
          return;
        }
        switch (data.type) {
          case 'start':
            this.side = data.color;
            this.gameManger.multiGameSetting(data);
            this.gameManger.multiGameStart();
            gameStartBtn.classList.remove('d-none');
            gameStartBtn.disabled = false;
            this.gameStart = false;
            break;
          case 'render':
            if (this.gameStart === false) {
              this.gameStart = true;
              this.gameEnd = false;
              this.gameError = false;
              gameStartBtn.classList.add('d-none');
              gameStartBtn.disabled = false;
            }
            this.redScore = data.redScore;
            this.blueScore = data.blueScore;
            this.gameManger.multiGameUpdateObjects(data);
            break;
          case 'result':
            this.gameEnd = true;
            SocketManager.gameSocket.close(1000, 'Game End');
            break;
          case 'exit':
            SocketManager.gameSocket.close(1000, 'Opponent Exit');
            break;
          default:
            break;
        }
      };
      SocketManager.gameSocket.onclose = () => {
        if (this.gameEnd === false) {
          ToastHandler.setToast(
            this.gameError
              ? 'Game Error. Please try again later.'
              : 'Opponent Exit'
          );
          Router.navigateTo('/game');
        } else {
          redScore.innerText = `${this.redScore}`;
          blueScore.innerText = `${this.blueScore}`;
          const winner = this.redScore > this.blueScore ? 'red' : 'blue';
          gameResult.innerText =
            this.side === winner ? 'You Win!' : 'You Lose!';
          gameResult.classList.add(
            this.side === 'red' ? 'text-danger' : 'text-primary'
          );
          gameResultModal.show();
        }
      };
      SocketManager.gameSocket.onerror = async () => {
        ToastHandler.setToast('Game Error! Please try again later');
        await Router.navigateTo('/game');
      };
    }
  }
}
export default PlayGame;
