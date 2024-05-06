import PageComponent from '@component/PageComponent.js';

class JoinRoom extends PageComponent {
  constructor() {
    super();
    this.setTitle('Join Room');
  }

  async render() {
    return `
      <h1 class="display-1 text-center">[ Room List ]</h1>
      <p>
        this is a join room page
      </p>
      `;
  }
}

export default JoinRoom;
