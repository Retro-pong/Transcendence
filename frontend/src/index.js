import Profile from '@pages/Profile.js';
import Login from '@pages/Login.js';
import Home from '@pages/Home.js';
import Friends from '@pages/Friends.js';
import Game from '@pages/Game.js';
import NavBar from '@component/navigation/NavBar.js';
import drawBackground from '@/background/background.js';

const navigateTo = (url) => {
  if (url === window.location.href) return;
  history.pushState(null, null, url);
  router();
};

// 동적라우팅 추가 필요
const router = async () => {
  const routes = {
    '/': Home,
    '/login': Login,
    '/profile': Profile,
    '/game': Game,
    '/friends': Friends,
  };

  const page = new routes[location.pathname]();
  const app = document.querySelector('#app');
  app.innerHTML = await page.render();
  if (page.getTitle() !== 'Login') {
    app.innerHTML += NavBar();
  }
  await page.afterRender();
};

window.addEventListener('popstate', router);

document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('click', (e) => {
    if (e.target.matches('[data-link]')) {
      e.preventDefault();
      navigateTo(e.target.href);
    }
  });
  router();
});

document.addEventListener('click', (e) => {
  const target = e.target || null;
  const collapseElement = document.querySelector('.collapse');
  if (collapseElement && !collapseElement.contains(target)) {
    collapseElement.classList.remove('show');
  }
});

drawBackground();
