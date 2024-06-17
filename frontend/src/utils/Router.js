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
import SocketManager from '@/utils/SocketManager';

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

  static async navigateTo(url) {
    SocketManager.closeSockets();
    if (url === window.location.href) {
      Router.replaceState(url);
    } else {
      Router.pushState(url);
    }
    await Router.render();
  }

  static getPathname() {
    return location.pathname;
  }

  static pushState(url) {
    history.pushState(null, '', url);
  }

  static replaceState(url) {
    history.replaceState(null, '', url);
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

  static setGamePageApp() {
    if (Router.app.classList.contains('container-fluid')) {
      Router.app.className = '';
    }
  }

  static resetPageApp() {
    if (
      !Router.app.classList.contains(
        'container-fluid p-5 min-vh-100 overflow-auto'
      )
    ) {
      Router.app.classList.add('container-fluid');
      Router.app.classList.add('p-5');
      Router.app.classList.add('min-vh-100');
      Router.app.classList.add('overflow-auto');
    }
  }

  static onRefresh(event) {
    event.preventDefault();
  }

  static async render() {
    const currPathname = Router.getPathname();
    const isLoggedIn = TokenManager.getLoginStatus();

    if (!(currPathname in Router.routes)) {
      Router.replaceState('/404');
    } else if (currPathname === '/login' && isLoggedIn) {
      ToastHandler.setToast('You are already logged in!');
      const beforePage = Router.getCurrentPage() || '/';
      if (beforePage === '/login') {
        Router.replaceState('/');
      } else {
        Router.replaceState(beforePage);
      }
    } else if (currPathname !== '/login' && !isLoggedIn) {
      Router.replaceState('/login');
    } else {
      Router.setCurrentPage(currPathname);
    }
    // TODO: 게임방 페이지에서 뒤로가기 제한
    // else if (currPathname === '/game') {
    // history.pushState(null, null, location.href);
    //  window.addEventListener('popstate', () => history.go(1));}

    const page = Router.getPageToRender();
    if (Router.getPathname() === '/game/play') {
      Router.hideElement(Router.background);
      Router.hideElement(Router.navBar);
      Router.setGamePageApp();
      window.addEventListener('beforeunload', Router.onRefresh);
    } else if (Router.getPathname() === '/game/waiting') {
      Router.hideElement(Router.navBar);
      window.addEventListener('beforeunload', Router.onRefresh);
    } else {
      if (
        Router.before &&
        typeof Router.before.getGameManager === 'function' &&
        Router.before.getGameManager()
      ) {
        if (SocketManager.gameSocket) {
          SocketManager.gameSocket.close();
        }
        Router.before.setDisposeAll();
      }
      window.removeEventListener('beforeunload', Router.onRefresh);
      Router.showElement(Router.background);
      Router.resetPageApp();
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
