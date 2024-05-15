import PageComponent from '@component/PageComponent.js';
import PlayerCard from '@component/card/PlayerCard';

class WaitingRoom extends PageComponent {
  constructor() {
    super();
    this.setTitle('Create Room');
  }

  async render() {
    const params = new URLSearchParams(document.location.search);
    const TITLE = params.get('title');
    const dummyPlayers = [
      {
        id: 1,
        name: 'hyobicho',
        status: 'ready',
        role: 'host',
      },
      {
        id: 2,
        name: 'hyungjpa',
        status: 'ready',
        role: 'guest',
      },
      {
        id: 3,
        name: 'wonjilee',
        status: 'ready',
        role: 'guest',
      },
      {
        id: 4,
        name: 'subinlee',
        status: 'ready',
        role: 'guest',
      },
    ];
    const PlayerCards = dummyPlayers
      .map((player) => {
        return `
          <div class="col d-flex align-items-center justify-content-center mb-2" >
            ${PlayerCard(player)}
          </div> 
        `;
      })
      .join('');
    return `
      <div class="container h-100 p-3 game-room-border">
        <h1 class="display-1 text-center">Welcome to<br /> [ ${TITLE} ]</h1>
        <div class="d-flex justify-content-center align-items-center h-75">
          <div class="container text-center w-100">
            <div class="row row-cols-1 row-cols-md-2 g-3">
              ${PlayerCards}
            </div>
          </div>
        </div>
      </div>
      `;
  }
}

export default WaitingRoom;
