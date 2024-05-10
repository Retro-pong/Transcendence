import PageComponent from '@component/PageComponent.js';

class WaitingRoom extends PageComponent {
  constructor() {
    super();
    this.setTitle('Create Room');
  }

  async render() {
    return `
      <div class="container h-100 p-3 game-room-border">
        <h1 class="display-1 text-center">Welcome to 'title'</h1>
        <div>
          waiting room
        </div>
      </div>
      `;
  }
}

export default WaitingRoom;
