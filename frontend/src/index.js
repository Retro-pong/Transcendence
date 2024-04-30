import Profile from '@pages/Profile.js';
import Login from '@pages/Login.js';
import Home from '@pages/Home.js';
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
  };

  const page = new routes[location.pathname]();

  document.querySelector('#app').innerHTML = await page.render();
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

drawBackground();
