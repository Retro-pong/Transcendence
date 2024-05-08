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

  const pathname = location.pathname;
  const user = localStorage.getItem('user');

  if (!(pathname in routes)) {
    navigateTo('/404');
    return;
  }

  if (pathname === '/login' && user) {
    alert('You are already logged in');
    navigateTo('/');
    return;
  } else if (pathname !== '/login' && !user) {
    navigateTo('/login');
    return;
  }

  const page = new routes[pathname]() || new routes['/']();
  const app = document.querySelector('#app');
  app.innerHTML = await page.render();
  if (page.getTitle() !== 'Login') {
    app.innerHTML += NavBar();
  }
  await page.afterRender();
};
