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

  async afterRender() {
    // After render
  }
}

export default PageComponent;
