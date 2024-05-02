class PageComponent {
  constructor() {
    this.state = null;
  }

  setTitle(title) {
    document.title = title;
  }

  getTitle() {
    return document.title;
  }

  async render() {
    return '';
  }
}

export default PageComponent;
