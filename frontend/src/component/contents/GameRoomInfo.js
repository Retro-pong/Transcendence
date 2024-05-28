const GameRoomInfo = ({ title, map, speed, ball }) => {
  const mapSrcs = {
    gameMap1: ['Futuristic Horizon', '/img/map_futuristic_horizon.jpg'],
    gameMap2: ['Mountain', '/img/map_mountain.jpg'],
    gameMap3: ['Pixel Rain', '/img/map_pixel_rain.jpg'],
  };
  const mapName = mapSrcs[map][0];
  const imgSrc = mapSrcs[map][1];
  const ballColor = ball.replace('0x', '#'); // 테스트용 (db 수정 예정)

  return `
<div class="container">
  <div class="d-flex justify-content-center align-items-center carousel">
      <img src="${imgSrc}" class="img-thumbnail w-75 h-75" alt="${mapName}"/>
      <div class="carousel-caption fs-3">
        ${mapName}
      </div>
  </div>
  <div class="d-flex justify-content-center align-items-center pt-3">
     <table class="table table-borderless table-dark fs-11">
      <tbody>
        <tr>
          <th scope="row">Title</th>
          <td>:</td>
          <td colspan="5">[${title}]</td>
        </tr>
        <tr>
          <th scope="row">Speed</th>
          <td>:</td>
          <td colspan="4">
            <input type="range" class="form-range" id="gameSpeedRange" min="0" max="5" step="1" value="${speed}" style="border: 0 !important;" disabled>
          </td>
          <td colspan="1">
            <span>X${speed}</span>
          </td>
        </tr>
        <tr>
          <th scope="row">Ball</th>
          <td>:</td>
          <td colspan="1" class="pt-4">
              <div class="border border-light rounded-2" style="background-color: ${ballColor}; width: 3rem; height: 3rem;"/>
          </td>
          <td colspan="3">${ballColor}</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>`;
};

export default GameRoomInfo;
