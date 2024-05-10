import PageComponent from '@component/PageComponent.js';

class CreateRoom extends PageComponent {
  constructor() {
    super();
    this.setTitle('Create Room');
  }

  async render() {
    return `
      <h1 class="display-1 text-center">[ Room Setting ]</h1>
      <p>
        this is a create room page
      </p>
      `;
  }
}

export default CreateRoom;
