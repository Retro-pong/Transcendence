import { Tooltip } from 'bootstrap';
import Router from '@/utils/Router';

class PageComponent {
  constructor() {
    this.state = null;
    this.currPage = 1;
    this.totalPage = 1;
    this.limit = 6;
    this.offset = 0;
    this.pathname = Router.getPathname();
  }

  setTitle(title) {
    document.title = title;
  }

  getOffset() {
    return this.limit * (this.currPage - 1);
  }

  async render() {
    return '';
  }

  async afterRender() {
    // After render
  }

  async getPageData() {
    return '';
  }

  initTooltip() {
    const tooltipTriggerList = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]'
    );
    [...tooltipTriggerList].map(
      (tooltipTriggerEl) => new Tooltip(tooltipTriggerEl)
    );
  }

  initEvent() {
    // Event
  }

  setPaginationStyle() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const currPage = document.getElementById('currPage');
    const totalPage = document.getElementById('totalPage');

    totalPage.innerHTML = this.totalPage;
    currPage.innerHTML = this.currPage;
    if (this.currPage === 1) {
      prevBtn.setAttribute('disabled', 'true');
    } else {
      prevBtn.removeAttribute('disabled');
    }
    if (this.currPage === this.totalPage) {
      nextBtn.setAttribute('disabled', 'true');
    } else {
      nextBtn.removeAttribute('disabled');
    }
  }

  onPaginationClick(child) {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const pageBody = document.getElementById('pageBody');
    prevBtn.addEventListener('click', async () => {
      if (this.currPage === 1) return;
      this.currPage -= 1;
      this.offset = this.getOffset();
      pageBody.innerHTML = await child.getPageData();
      this.setPaginationStyle();
      child.initEvent();
    });

    nextBtn.addEventListener('click', async () => {
      if (this.currPage === this.totalPage) return;
      this.currPage += 1;
      this.offset = this.getOffset();
      pageBody.innerHTML = await child.getPageData();
      this.setPaginationStyle();
      child.initEvent();
    });
  }

  async initPageData(child) {
    const pageBody = document.getElementById('pageBody');
    this.currPage = 1;
    this.offset = 0;
    pageBody.innerHTML = await child.getPageData();
    this.setPaginationStyle();
    child.initEvent();
  }

  onReloadButtonClick(child) {
    const reloadBtn = document.getElementById('reloadBtn');

    reloadBtn.addEventListener('click', async () => {
      await this.initPageData(child);
    });
  }

  onNavButtonClick() {
    const navigations = document.querySelectorAll('[data-nav="true"]');
    navigations.forEach((nav) => {
      nav.addEventListener('click', async (e) => {
        e.preventDefault();
        await Router.navigateTo(nav.href);
      });
    });
  }

  onPopstate() {
    // Popstate
  }
}

export default PageComponent;
