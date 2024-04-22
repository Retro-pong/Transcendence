class PageComponent {
  constructor() {
    this.state = null;
  }

  setTitle(title) {
    document.title = title;
  }

  async render() {
    return '';
  }
}

export default PageComponent;
