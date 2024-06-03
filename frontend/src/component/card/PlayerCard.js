const PlayerCard = ({ id, name, profileImg, win, lose }) => {
  return `
  <div class="col d-flex align-items-center justify-content-center mb-2" >
    <div class="justify-content-center px-3 game-player-card-border w-95" style="min-width: 400px;">
      <div class="row">
        <div class="col-md-8 align-self-center text-start fs-7">
          <div class="text-break">
            <div class="row">
              <span class="text-info text-opacity-75">Player ${id}</span>
            </div>
            <div class="row">
              <span>${name}</span>
            </div>
            <div class="row">
              <span>${win}W/${lose}L</span>
            </div>
          </div>
        </div>
        <div class="col-md-4 align-content-center">
          <div class="ratio ratio-1x1">
            <img src="${profileImg}" class="img-fluid" alt="profile" style="object-fit: cover;" />
          </div>
        </div>
      </div>
    </div>
  </div>
  `;
};

export default PlayerCard;
