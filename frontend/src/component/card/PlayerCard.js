const PlayerCard = ({ id, name, status, role }) => {
  const textColor = role === 'host' ? 'text-success' : '';
  const statusMessage = {
    ready: 'ready!',
    waiting: 'waiting...',
    playing: 'playing!',
  };
  return `
    <div class="justify-content-center px-3 game-player-card-border" style="width: 85%;">
      <div class="row">
        <div class="col-md-8 align-self-center text-start fs-7">
          <div class="text-break">
            <div class="row">
              <span class="${textColor}">Player ${id}</span>
            </div>
            <div class="row">
              <span class="">${name}</span>
            </div>
          </div>
        </div>
        <div class="col-md-4 align-content-center">
          <div class="ratio ratio-1x1">
            <img src="https://www.blueconomy.co.kr/news/photo/202402/2399_3001_921.png" class="img-fluid" alt="profile" style="object-fit: cover;" />
          </div>
        </div>
      </div>
      <div class="row align-self-center">
        <span class="fs-7">< ${statusMessage[status]} ></span>
      </div>
    </div>
  `;
};

export default PlayerCard;
