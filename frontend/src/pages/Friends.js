import PageComponent from '@component/PageComponent.js';

class Friends extends PageComponent {
  constructor() {
    super();
    this.setTitle('Friends');
  }

  async render() {
    return `
      <h1>Friends</h1>
      <p>
        This is Friends Page
      </p>
      `;
  }
}

export default Friends;
