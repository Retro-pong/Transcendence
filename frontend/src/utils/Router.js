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
  };

  static before = null;

  static app = document.getElementById('app');

  static background = document.getElementById('background');

  static navBar = document.getElementById('navBar');

  static async navigateTo(url) {
    if (url === Router.getPageHistory()) {
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

  static getPageHistory() {
    return sessionStorage.getItem('curPage') || '/';
  }

  static setPageHistory(path) {
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
    ToastHandler.setToast('Refreshing is not allowed here!');
  }

  static async render() {
    const currPathname = Router.getPathname();
    const isLoggedIn = TokenManager.getLoginStatus();

    if (!(currPathname in Router.routes)) {
      ToastHandler.setToast('Page not found! [404]');
      Router.replaceState(Router.getPageHistory());
    } else if (currPathname === '/login' && isLoggedIn) {
      ToastHandler.setToast('You are already logged in!');
      const beforePage = Router.getPageHistory();
      if (beforePage === '/login') {
        Router.replaceState('/');
      } else {
        Router.replaceState(beforePage);
      }
    } else if (currPathname !== '/login' && !isLoggedIn) {
      ToastHandler.setToast('You need to login!');
      Router.replaceState('/login');
    } else if (currPathname === '/game/waiting') {
      SocketManager.setRoomSocket();
    } else {
      Router.setPageHistory(currPathname);
    }
    document.title = '';
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
        SocketManager.closeGameSocket();
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

    const backDrop = document.getElementsByClassName('modal-backdrop');
    Array.prototype.forEach.call(backDrop, (back) => {
      back.remove();
    });
    document.body.className = '';
    document.body.style = '';

    Router.app.innerHTML = await page.render();
    await page.afterRender();
    Router.before = page;
  }
}

export default Router;
