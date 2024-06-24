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
    this.semiOneId = params.get('semi_1');
    this.semiTwoId = params.get('semi_2');
    this.finalId = params.get('final');
    this.gameMode = params.get('mode'); // normal, semi-final, final
    this.isFinalUser = false;

    switch (this.gameMode) {
      case 'normal':
        SocketManager.gameSocket = SocketManager.createSocket(
          `/${this.gameMode}_game/${this.gameId}/`
        );
        break;
      case 'semi-final':
        SocketManager.gameSocket = SocketManager.createSocket(
          `/semi_final_game/${this.semiOneId}/${this.semiTwoId}/${this.finalId}/`
        );
        break;
      case 'final':
        SocketManager.gameSocket = SocketManager.createSocket(
          `/final_game/${this.finalId}/`
        );
        break;
      default:
        break;
    }
    SocketManager.handlePopstate('game');

    this.gameManger = null;
    this.side = '';
    this.blueScore = '';
    this.redScore = '';
    this.gameStart = false;
    this.gameEnd = false;
    this.gameError = false;
    this.gameErrorMsg = 'Game Error. Please try again later.';
    this.redNick = '';
    this.blueNick = '';
  }

  getGameManager() {
    return this.gameManger;
  }

  setDisposeAll() {
    this.gameManger.disposeAll();
    this.gameManger = null;
    SocketManager.gameSocket = null;
  }

  async render() {
    const gameResultModal = ModalComponent({
      borderColor: 'pink',
      title: 'Game Result',
      modalId: 'gameResultModal',
      content: `
        <div class="d-flex flex-column justify-content-center align-items-center h-50">
          <div id="gameResult" class="fs-15 w-100 d-flex justify-content-center align-items-center"></div>
          <div class="w-100 d-flex align-items-center">
            <div id="modalRedNick" class="text-danger w-75 d-flex justify-content-center fs-9"></div>
            <div id="redScore" class="text-danger w-25 d-flex fs-12"></div>
          </div>          
          <div class="w-100 d-flex align-items-center">
            <div id="modalBlueNick" class="text-primary w-75 d-flex justify-content-center fs-9"></div>
            <div id="blueScore" class="text-primary w-25 d-flex fs-12"></div>
          </div>
        </div>
      `,
      buttonList: ['gameResultBtn'],
    });
    return `${gameResultModal}
    <div id="gameCanvasContainer" class="position-absolute vh-100 vw-100">
      <canvas id="gameCanvas" tabindex="0" class="vh-100 vw-100"></canvas>
      <button id="gameStartBtn" class="btn btn-outline-light position-absolute w-50 h-25 top-50 start-50 translate-middle fs-15 d-none rounded">
      Click Start !
      </button>
      <div id="scoreContainer"
           class="position-absolute top-0 start-50 translate-middle-x px-3 w-40 text-white d-flex flex-column align-items-center border border-5 rounded">
        <span class="fs-6">score</span>
        <div class="d-flex w-100 fs-6">
          <span id="player1Nick" class="w-50 d-flex justify-content-center text-danger">RED</span>
          <span id="player2Nick" class="w-50 d-flex justify-content-center text-primary">BLUE</span>
        </div>
        <div class="d-flex w-100 fs-8">
          <span id="player1Score" class="w-50 d-flex justify-content-center text-danger" data-score="0">0</span>
          <span id="player2Score" class="w-50 d-flex justify-content-center text-primary" data-score="0">0</span>
        </div>
      </div>
    </div>
    
    `;
  }

  async afterRender() {
    const gameResultModal = Modal.getOrCreateInstance('#gameResultModal');
    const gameResultModalElement = document.querySelector('#gameResultModal');
    const modalCloseBtn = document.querySelector('#gameResultBtn');
    const gameResult = document.querySelector('#gameResult');
    const modalRedNick = document.querySelector('#modalRedNick');
    const modalBlueNick = document.querySelector('#modalBlueNick');
    const redScore = document.querySelector('#redScore');
    const blueScore = document.querySelector('#blueScore');
    const gameStartBtn = document.querySelector('#gameStartBtn');

    modalCloseBtn.addEventListener('click', async () => {
      gameResultModal.hide();
    });

    const setGameResultModal = () => {
      const winner = this.redScore > this.blueScore ? 'red' : 'blue';
      modalRedNick.innerText = this.redNick;
      modalBlueNick.innerText = this.blueNick;
      redScore.innerText = this.gameEnd ? `${this.redScore}` : '';
      blueScore.innerText = this.gameEnd ? `${this.blueScore}` : '';
      if (this.gameEnd) {
        gameResult.innerText = this.side === winner ? 'You Win!' : 'You Lose!';
      } else {
        gameResult.innerText = 'Game End! User Disconnected!';
      }
      gameResult.classList.add(
        this.side === 'red' ? 'text-danger' : 'text-primary'
      );
    };

    gameResultModalElement.addEventListener('hidden.bs.modal', async () => {
      redScore.innerText = '';
      blueScore.innerText = '';
      const path = this.isFinalUser
        ? `/game/play?final=${this.finalId}&mode=final`
        : `/game`;
      await Router.navigateTo(path);
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
      this.gameManger.localGameRender();
      this.gameManger.localStartRendering();
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
        switch (data.type) {
          case 'start':
            this.side = data.color;
            this.gameManger.multiGameSetting(data);
            this.gameManger.multiGameStart();
            gameStartBtn.classList.remove('d-none');
            gameStartBtn.disabled = false;
            this.gameStart = false;
            gameResult.innerText = '';
            break;
          case 'render':
            if (this.gameStart === false) {
              this.gameStart = true;
              this.gameEnd = false;
              this.gameError = false;
              gameStartBtn.classList.add('d-none');
              gameStartBtn.disabled = false;
            }
            if (!this.redNick || !this.blueNick) {
              this.redNick = data.redNick;
              this.blueNick = data.blueNick;
              document.getElementById('player1Nick').innerText = this.redNick;
              document.getElementById('player2Nick').innerText = this.blueNick;
            }
            this.redScore = data.redScore;
            this.blueScore = data.blueScore;
            this.gameManger.multiGameUpdateObjects(data);
            break;
          case 'result':
            console.log('result', data);
            this.gameEnd = data.winner !== 'None';
            if (this.gameMode === 'semi-final') {
              // Fetch.showLoading();
            } else {
              SocketManager.gameSocket.close(1000, 'Game End');
            }
            break;
          case 'final':
            console.log('final', data);
            // Fetch.hideLoading();
            this.gameEnd = data.isFinal === 'True';
            this.isFinalUser = data.isFinalUser === 'True';
            SocketManager.gameSocket.close(1000, 'Game End');
            break;
          case 'exit':
            SocketManager.gameSocket.close(1000, 'Opponent Exit');
            break;
          case 'error':
            this.gameError = true;
            if (data.message) {
              this.gameErrorMsg = data.message;
            }
            SocketManager.gameSocket.close(1000, 'Game Error');
            break;
          default:
            break;
        }
      };
      SocketManager.gameSocket.onclose = async (e) => {
        console.log('game socket closed', e.code);

        if (this.gameEnd === false) {
          ToastHandler.setToast(
            this.gameError ? this.gameErrorMsg : 'User Exit'
          );
        }
        setGameResultModal();
        gameResultModal.show();
        SocketManager.gameSocket = null;
        await Router.navigateTo('/game');
      };
      SocketManager.gameSocket.onerror = () => {
        ToastHandler.setToast('Game Error! Please try again later');
        SocketManager.gameSocket = null;
      };
    }
  }
}
export default PlayGame;
