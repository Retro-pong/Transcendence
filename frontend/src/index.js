import drawBackground from '@/background/background.js';
import { navigateTo, router } from '@/utils/router';
import TokenManager from '@/utils/TokenManager';
import Fetch from '@/utils/Fetch';

Fetch.init();

window.addEventListener('popstate', router);

document.addEventListener('DOMContentLoaded', async () => {
  const navigations = document.getElementsByTagName('a');
  Array.prototype.forEach.call(navigations, (nav) => {
    nav.addEventListener('click', async (e) => {
      e.preventDefault();
      await navigateTo(nav.href);
    });
  });

  const logoutBtn = document.getElementById('logoutBtn');
  logoutBtn.addEventListener('click', async () => {
    await TokenManager.logout();
    await navigateTo('/login');
  });
  await router();
});

document.addEventListener('click', (e) => {
  const target = e.target || null;
  const collapseElement = document.querySelector('.collapse');
  if (collapseElement && !collapseElement.contains(target)) {
    collapseElement.classList.remove('show');
  }
});

drawBackground();
