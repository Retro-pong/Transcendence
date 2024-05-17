import drawBackground from '@/background/background.js';
import { navigateTo, router } from '@/utils/router';
import TokenManager from '@/utils/TokenManager';

window.addEventListener('popstate', router);

document.addEventListener('DOMContentLoaded', () => {
  TokenManager.authenticateUser().then(() => {
    document.body.addEventListener('click', (e) => {
      if (e.target.matches('[data-link]')) {
        e.preventDefault();
        navigateTo(e.target.href);
      }
    });
    document.getElementById('logoutBtn').addEventListener('click', async () => {
      await TokenManager.logout();
      navigateTo('/login');
    });
    router();
  });
});

document.addEventListener('click', (e) => {
  const target = e.target || null;
  const collapseElement = document.querySelector('.collapse');
  if (collapseElement && !collapseElement.contains(target)) {
    collapseElement.classList.remove('show');
  }
});

drawBackground();
