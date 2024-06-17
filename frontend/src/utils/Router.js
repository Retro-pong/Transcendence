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
  static routes = {
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

  static before = null;

  static app = document.getElementById('app');

  static background = document.getElementById('background');

  static navBar = document.getElementById('navBar');

  static gameCanvas = document.getElementById('gameCanvasContainer');

  static async navigateTo(url) {
    if (url === window.location.href) return;
    Router.pushState(url);
    await Router.render();
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

  static getPageToRender() {
    return new Router.routes[Router.getPathname()]();
  }

  static hideElement(element) {
    element.classList.add('d-none');
  }

  static showElement(element) {
    element.classList.remove('d-none');
  }

  static onRefresh(event) {
    event.preventDefault();
  }

  static async render() {
    const currPathname = Router.getPathname();
    const isLoggedIn = TokenManager.getLoginStatus();

    if (!(currPathname in Router.routes)) {
      Router.pushState('/404');
    } else if (currPathname === '/login' && isLoggedIn) {
      ToastHandler.setToast('You are already logged in!');
      const beforePage = Router.getCurrentPage();
      if (beforePage === '/login') {
        Router.pushState('/');
      } else {
        Router.pushState(beforePage);
      }
    } else if (currPathname !== '/login' && !isLoggedIn) {
      Router.pushState('/login');
    } else {
      Router.setCurrentPage(currPathname);
    }
    // TODO: 게임방 페이지에서 뒤로가기 제한
    // else if (currPathname === '/game') {
    // history.pushState(null, null, location.href);
    //  window.addEventListener('popstate', () => history.go(1));}

    const page = Router.getPageToRender();
    if (Router.getPathname() === '/game/play') {
      window.addEventListener('beforeunload', Router.onRefresh);
      Router.hideElement(Router.background);
      Router.hideElement(Router.navBar);
      Router.showElement(Router.gameCanvas);
    } else if (Router.getPathname() === '/game/waiting') {
      Router.hideElement(Router.navBar);
      window.addEventListener('beforeunload', Router.onRefresh);
      window.addEventListener('popstate', page.onPopstate);
    } else {
      if (
        Router.before &&
        typeof Router.before.getGameManager === 'function' &&
        Router.before.getGameManager()
      ) {
        Router.before.setDisposeAll();
      }
      if (Router.before && Router.before.getTitle() === 'WaitingRoom') {
        window.removeEventListener('popstate', Router.before.onPopstate);
      }
      window.removeEventListener('beforeunload', Router.onRefresh);
      Router.showElement(Router.background);
      Router.hideElement(Router.gameCanvas);
      if (Router.getPathname() !== '/login') {
        Router.showElement(Router.navBar);
      } else {
        Router.hideElement(Router.navBar);
      }
    }

    Router.app.innerHTML = await page.render();
    await page.afterRender();
    Router.before = page;
  }
}

export default Router;
