class PageComponent {
  constructor() {
    this.state = null;
    this.currPage = 1;
    this.totalPage = 1;
    this.limit = 6;
    this.offset = 1;
  }

  setTitle(title) {
    document.title = title;
  }

  getTitle() {
    return document.title;
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

  setPagination() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const currPage = document.getElementById('currPage');
    const totalPage = document.getElementById('totalPage');

    if (!prevBtn || !nextBtn || !currPage || !totalPage) return;

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
      pageBody.innerHTML = await child.getPageData();
    });

    nextBtn.addEventListener('click', async () => {
      if (this.currPage === this.totalPage) return;
      this.currPage += 1;
      pageBody.innerHTML = await child.getPageData();
    });
  }

  onReloadButtonClick(child) {
    const reloadBtn = document.getElementById('reloadBtn');
    const pageBody = document.getElementById('pageBody');

    reloadBtn.addEventListener('click', async () => {
      this.currPage = 1;
      pageBody.innerHTML = await child.getPageData();
    });
  }
}

export default PageComponent;
