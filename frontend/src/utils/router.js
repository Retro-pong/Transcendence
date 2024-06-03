import Home from '@pages/Home';
import Login from '@pages/Login';
import Profile from '@pages/Profile';
import Game from '@pages/game/Game';
import CreateRoom from '@pages/game/CreateRoom';
import JoinRoom from '@pages/game/JoinRoom';
import WaitingRoom from '@pages/game/WaitingRoom';
import Friends from '@pages/Friends';
import PlayGame from '@pages/game/PlayGame';
import TokenManager from '@/utils/TokenManager';
import ToastHandler from '@/utils/ToastHandler';

class Router {
  static #routes = {
    '/': Home,
    '/login': Login,
    '/profile': Profile,
    '/game': Game,
    '/game/create': CreateRoom,
    '/game/join': JoinRoom,
    '/game/waiting': WaitingRoom,
    '/game/play': PlayGame,
    '/friends': Friends,
    '/404': Home, // TODO: NotFound 추가
  };

  static app = document.getElementById('app');

  static background = document.getElementById('background');

  static navBar = document.getElementById('navBar');

  static gameCanvas = document.getElementById('gameCanvasContainer');

  static async navigateTo(url) {
    if (url === window.location.href) return;
    history.pushState(null, null, url);
    await this.render();
  }

  static getPathname() {
    return location.pathname;
  }

  static pushState(url) {
    history.pushState(null, null, url);
  }

  static replaceState(url) {
    history.replaceState(null, null, url);
  }

  static getCurrentPage() {
    return sessionStorage.getItem('curPage');
  }

  static setCurrentPage(path) {
    sessionStorage.setItem('curPage', path);
  }

  static #getPageToRender() {
    return new this.#routes[this.getPathname()]();
  }

  static async render() {
    const currPathname = this.getPathname();
    const isLoggedIn = TokenManager.getLoginStatus();

    if (!(currPathname in this.#routes)) {
      this.pushState('/404');
    } else if (currPathname === '/login' && isLoggedIn) {
      ToastHandler.setToast('You are already logged in!');
      let beforePage = this.getCurrentPage();
      if (beforePage === '/login') {
        beforePage = '/';
      }
      this.pushState(beforePage);
    } else if (currPathname !== '/login' && !isLoggedIn) {
      this.pushState('/login');
    } else {
      window.localStorage.setItem('curPage', currPathname);
    }
    // TODO: 게임방 페이지에서 뒤로가기 제한
    // else if (currPathname === '/game') {
    // history.pushState(null, null, location.href);
    //  window.addEventListener('popstate', () => history.go(1));}

    const page = this.#getPageToRender();

    // const app = document.querySelector('#app');
    // const background = document.getElementById('background');
    // const navBar = document.getElementById('navBar');
    // const gameCanvas = document.getElementById('gameCanvasContainer');

    if (this.getPathname() === '/game/play') {
      this.background.classList.add('d-none');
      this.app.classList.add('d-none');
      this.navBar.classList.add('d-none');
      this.gameCanvas.classList.remove('d-none');
    } else {
      this.background.classList.remove('d-none');
      this.app.classList.remove('d-none');
      this.gameCanvas.classList.add('d-none');
      if (this.getPathname() !== '/login') {
        this.navBar.classList.remove('d-none');
      } else {
        this.navBar.classList.add('d-none');
      }
    }

    this.app.innerHTML = await page.render();
    await page.afterRender();
  }
}

export default Router;
