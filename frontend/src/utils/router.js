import Home from '@pages/Home';
import Login from '@pages/Login';
import Profile from '@pages/Profile';
import Game from '@pages/game/Game';
import CreateRoom from '@pages/game/CreateRoom';
import JoinRoom from '@pages/game/JoinRoom';
import Friends from '@pages/Friends';
import NavBar from '@component/navigation/NavBar';

export const navigateTo = (url) => {
  if (url === window.location.href) return;
  history.pushState(null, null, url);
  router();
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
    '/friends': Friends,
    '/404': Home, // TODO: NotFound 추가
  };

  const currPathname = location.pathname;
  const user = localStorage.getItem('user');

  if (!(currPathname in routes)) {
    history.pushState(null, null, '/404');
  } else if (currPathname === '/login' && user) {
    alert('You are already logged in!');
    history.pushState(null, null, '/');
  } else if (currPathname !== '/login' && !user) {
    history.pushState(null, null, '/login');
  }

  const page = new routes[location.pathname]();
  const app = document.querySelector('#app');
  app.innerHTML = await page.render();
  if (page.getTitle() !== 'Login') {
    app.innerHTML += NavBar();
  }
  await page.afterRender();
};
