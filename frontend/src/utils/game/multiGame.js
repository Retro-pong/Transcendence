import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import createMap from './createMap';
import createGameObject from '@/utils/game/createGameObject';
import eventHandler from '@/utils/game/eventHandler';
import hitChangeColor from '@/utils/game/hitChangeColor';
import checkPaddleHit from '@/utils/game/checkPaddleHit';

function multiGame(settings) {
  const canvas = document.getElementById('gameCanvasMulti');
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

  const fov = 45;
  const aspect = 2; // the canvas default
  const near = 0.1;
  const far = 1000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(-33, 0, 0);

  const controls = new OrbitControls(camera, canvas);
  controls.update();
  controls.enableRotate = false;
  controls.enableZoom = false;
  controls.enablePan = false;

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

  {
    const skyColor = 0xb1e1ff; // light blue
    const groundColor = 0xb97a20; // brownish orange
    const intensity = 2;
    const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    scene.add(light);
  }

  {
    const color = 0xffffff;
    const intensity = 2.5;
    const light1 = new THREE.DirectionalLight(color, intensity);
    const light2 = new THREE.DirectionalLight(color, intensity);
    light1.position.set(-40, 0, 0);
    light2.position.set(40, 0, 0);
    scene.add(light1);
    scene.add(light2);
    scene.add(light1.target);
    scene.add(light2.target);
  }

  createMap(scene);
  createGameObject(scene, settings.ball);
  eventHandler(canvas, scene, camera, controls);

  const ball = scene.getObjectByName('ball');
  const ballPlane = scene.getObjectByName('ballPlane');
  const redPlayerScore = document.getElementById('player1Score');
  const bluePlayerScore = document.getElementById('player2Score');

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    renderer.setPixelRatio(window.devicePixelRatio);
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  let a;
  let b;
  let c;
  const v = 1.5 + settings.speed * 0.15;
  let start = 'blue';
  let hitStatus;

  function startGameSetting() {
    a = start === 'blue' ? 0.15 : -0.15;
    b = 0.1;
    c = 0.1;
    hitStatus = {
      redPaddleHit: 10,
      bluePaddleHit: 10,
      topWallHit: 10,
      bottomWallHit: 10,
      rightWallHit: 10,
      leftWallHit: 10,
    };
    ball.position.set(
      start === 'blue' ? -18 : 18,
      Math.random() * 8 - 4,
      Math.random() * 12 - 6
    );
    start = 'off';
  }

  function render() {
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }
    if (ball) {
      if (start !== 'off') {
        startGameSetting();
      } else {
        ball.position.x += a * v;
        ball.position.y += b * v;
        ball.position.z += c * v;
        ball.rotation.set(
          ball.rotation.x + 0.1,
          ball.rotation.y + 0.1,
          ball.rotation.z + 0.1
        );
        ballPlane.position.x = ball.position.x;
        // 패들에 부딪히면 방향 바꾸기
        if (ball.position.x > 19.8 && ball.position.x < 20.2) {
          if (!checkPaddleHit('red', scene)) {
            bluePlayerScore.innerText = (
              parseInt(bluePlayerScore.innerText, 10) + 1
            ).toString();
            start = 'blue';
          } else {
            a *= -1;
            hitStatus.redPaddleHit = 1;
          }
        }
        if (ball.position.x < -19.8 && ball.position.x > -20.2) {
          if (!checkPaddleHit('blue', scene)) {
            redPlayerScore.innerText = (
              parseInt(redPlayerScore.innerText, 10) + 1
            ).toString();
            start = 'red';
          } else {
            a *= -1;
            hitStatus.bluePaddleHit = 1;
          }
        }

        // 벽에 부딪히면 방향 바꾸기
        if (ball.position.z < -7 && ball.position.z > -8) {
          c *= -1;
          hitStatus.leftWallHit = 1;
        }
        if (ball.position.z > 7 && ball.position.z < 8) {
          c *= -1;
          hitStatus.rightWallHit = 1;
        }
        if (ball.position.y > 4.5 && ball.position.y < 5.5) {
          b *= -1;
          hitStatus.topWallHit = 1;
        }
        if (ball.position.y < -4.5 && ball.position.y > -5.5) {
          b *= -1;
          hitStatus.bottomWallHit = 1;
        }
        hitStatus = hitChangeColor(hitStatus, scene, settings.speed);
      }
    }

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

export default multiGame;
