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
import ErrorHandler from '@/utils/ErrorHandler';

export const navigateTo = async (url) => {
  if (url === window.location.href) return;
  history.pushState(null, null, url);
  await router();
};

// 동적라우팅 추가 필요
export const router = async () => {
  const routes = {
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

  const currPathname = location.pathname;
  const isLoggedIn = TokenManager.getLoginStatus();

  if (!(currPathname in routes)) {
    history.pushState(null, null, '/404');
  } else if (currPathname === '/login' && isLoggedIn) {
    ErrorHandler.setToast('You are already logged in!');
    let beforePage = window.localStorage.getItem('curPage');
    if (beforePage === '/login') {
      beforePage = '/';
    }
    history.pushState(null, null, beforePage);
  } else if (currPathname !== '/login' && !isLoggedIn) {
    history.pushState(null, null, '/login');
  } else {
    window.localStorage.setItem('curPage', currPathname);
  }
  // TODO: 게임방 페이지에서 뒤로가기 제한
  // else if (currPathname === '/game') {
  // history.pushState(null, null, location.href);
  //  window.addEventListener('popstate', () => history.go(1));}

  const page = new routes[location.pathname]();
  const app = document.querySelector('#app');
  const background = document.getElementById('background');
  const navBar = document.getElementById('navBar');
  const gameCanvas = document.getElementById('gameCanvas');

  if (location.pathname === '/game/play') {
    background.classList.add('d-none');
    app.classList.add('d-none');
    navBar.classList.add('d-none');
    gameCanvas.classList.remove('d-none');
  } else {
    background.classList.remove('d-none');
    app.classList.remove('d-none');
    gameCanvas.classList.add('d-none');
    if (location.pathname === '/login') {
      navBar.classList.remove('d-none');
    } else {
      navBar.classList.add('d-none');
    }
  }

  app.innerHTML = await page.render();
  await page.afterRender();
};
