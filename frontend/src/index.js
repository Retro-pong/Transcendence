import drawBackground from '@/background/background.js';
import { navigateTo, router } from '@/utils/router';
import TokenManager from '@/utils/TokenManager';
import Fetch from '@/utils/Fetch';

Fetch.init();

window.addEventListener('popstate', router);

document.addEventListener('DOMContentLoaded', async () => {
  const navigation = document.querySelector('#navBarCollapse');
  navigation.addEventListener('click', (e) => {
    if (e.target.matches('[data-link]')) {
      e.preventDefault();
      navigateTo(e.target.href);
    }
    document.getElementById('logoutBtn').addEventListener('click', async () => {
      await TokenManager.logout();
      navigateTo('/login');
    });
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
