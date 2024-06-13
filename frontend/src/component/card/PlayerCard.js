import PlayerInfo from '@component/card/PlayerInfo';

const PlayerCard = ({ id, name, profileImg, win, lose }) => {
  return `
      <div class="row game-player-card-border g-3 ">
        ${PlayerInfo({ id, name, profileImg, win, lose })}
      </div>
  `;
};

export default PlayerCard;
