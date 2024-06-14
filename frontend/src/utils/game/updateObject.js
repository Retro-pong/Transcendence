import hitChangeColor from '@/utils/game/hitChangeColor';

const updateObject = (data, scene, settings) => {
  const redPaddle = scene.getObjectByName('redPaddle');
  const bluePaddle = scene.getObjectByName('bluePaddle');
  const ball = scene.getObjectByName('ball');
  const redPlayerScore = document.getElementById('player1Score');
  const bluePlayerScore = document.getElementById('player2Score');

  let multiHitStatus = {
    redPaddleHit: 10,
    bluePaddleHit: 10,
    topWallHit: 10,
    bottomWallHit: 10,
    rightWallHit: 10,
    leftWallHit: 10,
  };

  redPlayerScore.innerText = data.redScore;
  bluePlayerScore.innerText = data.blueScore;

  if (redPaddle) {
    redPaddle.position.set(-20, data.redY, data.redZ);
  }
  if (bluePaddle) {
    bluePaddle.position.set(20, data.blueY, data.blueZ);
  }
  if (ball) {
    ball.position.set(data.ballX, data.ballY, data.ballZ);
  }
  switch (parseInt(data.ballHit, 10)) {
    case 1:
      multiHitStatus.redPaddleHit = 1;
      break;
    case 2:
      multiHitStatus.bluePaddleHit = 1;
      break;
    case 3:
      multiHitStatus.leftWallHit = 1;
      break;
    case 4:
      multiHitStatus.rightWallHit = 1;
      break;
    case 5:
      multiHitStatus.topWallHit = 1;
      break;
    case 6:
      multiHitStatus.bottomWallHit = 1;
      break;
    default:
      break;
  }
  multiHitStatus = hitChangeColor(multiHitStatus, scene, settings.speed);
};

export default updateObject;
