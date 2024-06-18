const localGameCustomSetting = (gameManager) => {
  const scoreContainer = document.getElementById('scoreContainer');

  const openSettingButton = document.createElement('button');
  openSettingButton.id = 'openSettingButton';
  openSettingButton.className = 'btn btn-outline-light w-100 my-1 fs-3';
  openSettingButton.innerText = 'Open Setting - Pause Game';

  openSettingButton.addEventListener('click', () => {
    const buttonContainer = document.getElementById('buttonContainer');
    if (openSettingButton.innerText === 'Open Setting - Pause Game') {
      openSettingButton.innerText = 'Close Setting - Restart Game';
      buttonContainer.classList.remove('d-none');
      gameManager.localStopRendering();
    } else {
      openSettingButton.innerText = 'Open Setting - Pause Game';
      buttonContainer.classList.add('d-none');
      document.getElementById('gameCanvas').focus();
      gameManager.resetGameScore();
      gameManager.localStartRendering();
    }
  });

  const buttonContainer = document.createElement('div');
  buttonContainer.id = 'buttonContainer';
  buttonContainer.className =
    'd-flex flex-column align-items-center w-100 fs-10 d-none border border-success border-5 rounded bg-dark my-3';

  const mapButton = document.createElement('button');
  const ballColorButton = document.createElement('button');
  const speedButton = document.createElement('button');

  buttonContainer.append(speedButton);
  buttonContainer.append(ballColorButton);
  buttonContainer.append(mapButton);

  mapButton.id = 'localMapButton';
  ballColorButton.id = 'localBallColorButton';
  speedButton.id = 'localSpeedButton';

  mapButton.className = 'btn btn-outline-light fs-8 w-100';
  ballColorButton.className = 'btn btn-outline-light fs-8 w-100';
  speedButton.className = 'btn btn-outline-light fs-8 w-100';

  mapButton.innerText = 'Mountain';
  ballColorButton.innerText = 'BALL COLOR';
  speedButton.innerText = 'speed X3';

  ballColorButton.style.color = `#0000ff`;

  mapButton.addEventListener('click', () => {
    if (mapButton.innerText === 'Mountain') {
      mapButton.innerText = 'Futuristic Horizon';
    } else if (mapButton.innerText === 'Futuristic Horizon') {
      mapButton.innerText = 'Pixel Rain';
    } else {
      mapButton.innerText = 'Mountain';
    }
    gameManager.setLocalGameMap(mapButton.innerText);
  });

  ballColorButton.addEventListener('click', () => {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    const hexColor = parseInt(`0x${randomColor.padStart(6, '0')}`, 16);
    ballColorButton.innerText = `BALL COLOR`;
    ballColorButton.style.color = `#${randomColor}`;
    gameManager.setLocalGameBallColor(hexColor);
  });

  speedButton.addEventListener('click', () => {
    const curSpeed = parseInt(speedButton.innerText.at(-1), 10);
    speedButton.innerText = `speed x${(curSpeed % 5) + 1}`;
    gameManager.setLocalGameSpeed(parseInt(speedButton.innerText.at(-1), 10));
    gameManager.resetLocalGameInfo();
  });

  scoreContainer.append(openSettingButton);
  scoreContainer.append(buttonContainer);
};

export default localGameCustomSetting;
