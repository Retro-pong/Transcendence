import * as THREE from 'three';
import createMap from './createMap';
import createGameObject from '@/utils/game/createGameObject';
import eventHandler from '@/utils/game/eventHandler';
import hitChangeColor from '@/utils/game/hitChangeColor';
import checkPaddleHit from '@/utils/game/checkPaddleHit';
import cameraSetting from '@/utils/game/cameraSetting';
import rendering from '@/utils/game/rendering';
import sceneSetting from '@/utils/game/sceneSetting';
import resizeRendererToDisplaySize from '@/utils/game/resizeRendererToDisplaySize';

function game(settings, data, socket) {
  const canvas = document.getElementById('gameCanvas');
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
  const camera = cameraSetting(settings.mode, settings.side);

  const scene = new THREE.Scene();

  // 배경 이미지
  const mapList = {
    horizon: '/img/map_futuristic_horizon.jpg',
    mountain: '/img/map_mountain.jpg',
    pixel: '/img/map_pixel_rain.jpg',
  };

  const loader = new THREE.TextureLoader();
  loader.load(mapList[settings.map], function (texture) {
    scene.background = texture;
  });

  sceneSetting(scene);
  createMap(scene);
  createGameObject(scene, settings.ball);
  eventHandler(canvas, scene, camera, settings, socket);

  const ball = scene.getObjectByName('ball');
  const ballPlane = scene.getObjectByName('ballPlane');
  const redPlayerScore = document.getElementById('player1Score');
  const bluePlayerScore = document.getElementById('player2Score');
  const redPaddle = scene.getObjectByName('redPaddle');
  const bluePaddle = scene.getObjectByName('bluePaddle');

  const localInfo = {
    a: 0,
    b: 0,
    c: 0,
    v: 1.2 + settings.speed * 0.3,
    start: 'blue',
    hitStatus: {
      redPaddleHit: 10,
      bluePaddleHit: 10,
      topWallHit: 10,
      bottomWallHit: 10,
      rightWallHit: 10,
      leftWallHit: 10,
    },
  };
  let multiHitStatus = {
    redPaddleHit: 10,
    bluePaddleHit: 10,
    topWallHit: 10,
    bottomWallHit: 10,
    rightWallHit: 10,
    leftWallHit: 10,
  };

  function localStartGameSetting() {
    localInfo.a = localInfo.start === 'blue' ? 0.2 : -0.2;
    localInfo.b = 0.1;
    localInfo.c = 0.1;
    ball.position.set(
      localInfo.start === 'blue' ? -18 : 18,
      Math.random() * 8 - 4,
      Math.random() * 12 - 6
    );
    localInfo.start = 'off';
  }

  function render() {
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      let aspect;
      if (settings.mode === 'local' && camera.red && camera.blue) {
        aspect = canvas.clientWidth / 2 / canvas.clientHeight;
        camera.blue.aspect = aspect;
        camera.blue.updateProjectionMatrix();
        camera.red.aspect = aspect;
        camera.red.updateProjectionMatrix();
      }
      if (settings.mode === 'multi' && camera.multi) {
        aspect = canvas.clientWidth / canvas.clientHeight;
        camera.multi.aspect = aspect;
        camera.multi.updateProjectionMatrix();
      }
    }

    if (ball) {
      // 로컬게임
      if (settings.mode === 'local') {
        if (localInfo.start !== 'off') {
          localStartGameSetting();
        } else {
          ball.position.x += localInfo.a * localInfo.v;
          ball.position.y += localInfo.b * localInfo.v;
          ball.position.z += localInfo.c * localInfo.v;
          ball.rotation.set(
            ball.rotation.x + 0.1,
            ball.rotation.y + 0.1,
            ball.rotation.z + 0.1
          );
          ballPlane.position.x = ball.position.x;
          // 패들에 부딪히면 방향 바꾸기
          if (ball.position.x > 19.7 && ball.position.x < 20.3) {
            if (!checkPaddleHit('red', scene)) {
              bluePlayerScore.innerText = (
                parseInt(bluePlayerScore.innerText, 10) + 1
              ).toString();
              localInfo.start = 'blue';
            } else {
              localInfo.a *= -1;
              localInfo.hitStatus.redPaddleHit = 1;
            }
          }
          if (ball.position.x < -19.7 && ball.position.x > -20.3) {
            if (!checkPaddleHit('blue', scene)) {
              redPlayerScore.innerText = (
                parseInt(redPlayerScore.innerText, 10) + 1
              ).toString();
              localInfo.start = 'red';
            } else {
              localInfo.a *= -1;
              localInfo.hitStatus.bluePaddleHit = 1;
            }
          }
          if (
            localInfo.hitStatus.redPaddleHit ||
            localInfo.hitStatus.bluePaddleHit
          ) {
            localInfo.v = 3;
          }
          if (
            !localInfo.hitStatus.redPaddleHit &&
            !localInfo.hitStatus.bluePaddleHit
          ) {
            localInfo.v = 1.2 + settings.speed * 0.3;
          }

          // 벽에 부딪히면 방향 바꾸기
          if (ball.position.z < -7 && ball.position.z > -8) {
            localInfo.c *= -1;
            localInfo.hitStatus.leftWallHit = 1;
          }
          if (ball.position.z > 7 && ball.position.z < 8) {
            localInfo.c *= -1;
            localInfo.hitStatus.rightWallHit = 1;
          }
          if (ball.position.y > 4.5 && ball.position.y < 5.5) {
            localInfo.b *= -1;
            localInfo.hitStatus.topWallHit = 1;
          }
          if (ball.position.y < -4.5 && ball.position.y > -5.5) {
            localInfo.b *= -1;
            localInfo.hitStatus.bottomWallHit = 1;
          }
          localInfo.hitStatus = hitChangeColor(
            localInfo.hitStatus,
            scene,
            settings.speed
          );
        }
      } // 멀티게임
      else {
        redPaddle.position.set(-20, data.redY, data.redZ);
        bluePaddle.position.set(20, data.blueY, data.blueZ);
        ball.position.set(data.ballX, data.ballY, data.ballZ);
        switch (parseInt(data.ballHit, 10)) {
          case 0:
            break;
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
        redPlayerScore.innerText = data.redScore;
        bluePlayerScore.innerText = data.blueScore;
        multiHitStatus = hitChangeColor(multiHitStatus, scene, settings.speed);
      }
    }
    rendering(renderer, scene, camera, settings.mode);
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

export default game;
