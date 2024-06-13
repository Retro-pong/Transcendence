const PlayerCard = ({ id, name, profileImg, win, lose }) => {
  const score = name ? `${win}W/${lose}L` : '...';

  return `
      <div class="row game-player-card-border g-3">
        <div class="col-md-8 align-self-center text-start fs-7">
          <div class="text-break">
            <div class="row">
              <span id='player${id}-id' class="text-info text-opacity-75">Player ${id}</span>
            </div>
            <div class="row">
              <span id='player${id}-name' >${name || 'waiting...'}</span>
            </div>
            <div class="row">
              <span id='player${id}-score' >${score}</span>
            </div>
          </div>
        </div>
        <div class="col-md-4 align-content-center">
          <div id='player${id}-img' class="ratio ratio-1x1">
            ${profileImg ? `<img src="${profileImg}" onerror="this.src='/img/profile_fallback.jpg';" class="img-fluid" alt="profile" style="object-fit: cover;" />` : ''}
          </div>
        </div>
      </div>
  `;
};

export default PlayerCard;
