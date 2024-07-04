import { Modal } from 'bootstrap';
import hitChangeColor from '@/utils/game/utils/hitChangeColor';
import checkPaddleHit from '@/utils/game/utils/checkPaddleHit';
import localGameStartSetting from '@/utils/game/utils/localGameStartSetting';

function localGame(scene, objects, localGameInfo, gameSpeed, renderRequestId, gameManager) {
  let newLocalGameInfo = { ...localGameInfo };
  newLocalGameInfo.hitStatus = { ...localGameInfo.hitStatus };

  const redScore = parseInt(objects.redPlayerScore.innerText, 10);
  const blueScore = parseInt(objects.bluePlayerScore.innerText, 10);

  if (redScore >= 5 || blueScore >= 5) {
    cancelAnimationFrame(renderRequestId);
    const gameResultModal = Modal.getOrCreateInstance('#gameResultModal');
    const gameResult = document.querySelector('#gameResult');
    const winner = redScore > blueScore ? 'red' : 'blue';
    gameResult.innerText = `${winner} Win!`;
    gameResult.classList.add(winner === 'red' ? 'text-danger' : 'text-primary');
    gameResultModal.show();
    return newLocalGameInfo;
  }

  if (objects.ball) {
    if (newLocalGameInfo.start !== 'off') {
      newLocalGameInfo = localGameStartSetting(newLocalGameInfo, objects.ball);
    } else {
      objects.ball.position.set(
        objects.ball.position.x + newLocalGameInfo.a * newLocalGameInfo.v,
        objects.ball.position.y + newLocalGameInfo.b * newLocalGameInfo.v,
        objects.ball.position.z + newLocalGameInfo.c * newLocalGameInfo.v
      );
      objects.ball.rotation.set(
        objects.ball.rotation.x + 0.1,
        objects.ball.rotation.y + 0.1,
        objects.ball.rotation.z + 0.1
      );
      objects.ballPlane.position.set(
        objects.ball.position.x,
        objects.ballPlane.position.y,
        objects.ballPlane.position.z
      );
      // 패들에 부딪히면 방향 바꾸기
      if (objects.ball.position.x > 19.5 && objects.ball.position.x < 20.5) {
        if (!checkPaddleHit('red', scene)) {
          document.getElementById('player2Score').innerText = (
            parseInt(objects.bluePlayerScore.innerText, 10) + 1
          ).toString();
          newLocalGameInfo.start = 'blue';
          gameManager.localGameScoreSettingTime();
        } else {
          newLocalGameInfo.a *= -1;
          newLocalGameInfo.hitStatus.redPaddleHit = 1;
        }
      }
      if (objects.ball.position.x < -19.5 && objects.ball.position.x > -20.5) {
        if (!checkPaddleHit('blue', scene)) {
          document.getElementById('player1Score').innerText = (
            parseInt(objects.redPlayerScore.innerText, 10) + 1
          ).toString();
          newLocalGameInfo.start = 'red';
          gameManager.localGameScoreSettingTime();
        } else {
          newLocalGameInfo.a *= -1;
          newLocalGameInfo.hitStatus.bluePaddleHit = 1;
        }
      }
      if (
        newLocalGameInfo.hitStatus.redPaddleHit ||
        newLocalGameInfo.hitStatus.bluePaddleHit
      ) {
        newLocalGameInfo.v = 3;
      }
      if (
        !newLocalGameInfo.hitStatus.redPaddleHit &&
        !newLocalGameInfo.hitStatus.bluePaddleHit
      ) {
        newLocalGameInfo.v = 1.2 + 0.3 * gameSpeed;
      }

      // 벽에 부딪히면 방향 바꾸기
      if (objects.ball.position.z < -7.2 && objects.ball.position.z > -7.8) {
        newLocalGameInfo.c *= -1;
        newLocalGameInfo.hitStatus.leftWallHit = 1;
      }
      if (objects.ball.position.z > 7.2 && objects.ball.position.z < 7.8) {
        newLocalGameInfo.c *= -1;
        newLocalGameInfo.hitStatus.rightWallHit = 1;
      }
      if (objects.ball.position.y > 4.7 && objects.ball.position.y < 5.3) {
        newLocalGameInfo.b *= -1;
        newLocalGameInfo.hitStatus.topWallHit = 1;
      }
      if (objects.ball.position.y < -4.7 && objects.ball.position.y > -5.3) {
        newLocalGameInfo.b *= -1;
        newLocalGameInfo.hitStatus.bottomWallHit = 1;
      }
      newLocalGameInfo.hitStatus = hitChangeColor(
        newLocalGameInfo.hitStatus,
        scene
      );
    }
  }
  return newLocalGameInfo;
}

export default localGame;
