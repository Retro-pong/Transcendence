const GameRoomInfo = ({ title, map, speed, ball }) => {
  return `
    <div class="row row-cols-2">
      <div id="gameTitle" class="col">
        ${title}
      </div>
      <div id="gameBall" class="col">
        ${ball}
      </div>
      <div id="gameSpeed" class="col">
        ${speed}
      </div>
      <div id="gameMap" class="col">
        ${map}
      </div>
    </div>`;
};

export default GameRoomInfo;
