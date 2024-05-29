import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import createMap from './createMap';
import createGameObject from '@/utils/game/createGameObject';
import eventHandler from '@/utils/game/eventHandler';

function game(map) {
  const canvas = document.getElementById('gameCanvas');
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
  loader.load(mapList[map], function (texture) {
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
  createGameObject(scene);
  eventHandler(canvas, scene, camera, renderer, controls);

  const ball = scene.getObjectByName('ball');
  const ballPlane = scene.getObjectByName('ballPlane');
  const redPaddle = scene.getObjectByName('redPaddle');
  const bluePaddle = scene.getObjectByName('bluePaddle');
  const redPaddleBox = scene.getObjectByName('redPaddleBox');
  const bluePaddleBox = scene.getObjectByName('bluePaddleBox');
  const topPlane = scene.getObjectByName('topPlane');
  const bottomPlane = scene.getObjectByName('bottomPlane');
  const rightPlane = scene.getObjectByName('rightPlane');
  const leftPlane = scene.getObjectByName('leftPlane');

  function checkPaddleHit(type) {
    let py;
    let pz;
    if (type === 'red') {
      py = redPaddle.position.y;
      pz = redPaddle.position.z;
    } else {
      py = bluePaddle.position.y;
      pz = bluePaddle.position.z;
    }
    const by = ball.position.y;
    const bz = ball.position.z;
    // 범위 안에 들어왔는지 체크
    if (
      ((by - 1 > py - 1.5 && by - 1 < py + 1.5) ||
        (by + 1 > py - 1.5 && by + 1 < py + 1.5)) &&
      ((bz - 1 > pz - 1.5 && bz - 1 < pz + 1.5) ||
        (bz + 1 > pz - 1.5 && bz + 1 < pz + 1.5))
    ) {
      return 1;
    }
    return 0;
  }

  let redPaddleHit = 0;
  let bluePaddleHit = 0;
  let topWallHit = 0;
  let bottomWallHit = 0;
  let rightWallHit = 0;
  let leftWallHit = 0;

  function paddleHitChangeColor() {
    if (redPaddleHit === 1) {
      for (let i = 0; i < redPaddleBox.children.length; i += 1) {
        redPaddleBox.children[i].material.color.set(0x00ffff);
      }
      redPaddleHit = 2;
    } else if (redPaddleHit >= 2 && redPaddleHit < 10) {
      redPaddleHit += 1;
    } else if (redPaddleHit === 10) {
      for (let i = 0; i < redPaddleBox.children.length; i += 1) {
        redPaddleBox.children[i].material.color.set(0xff0000);
      }
      redPaddleHit = 0;
    }
    if (bluePaddleHit === 1) {
      for (let i = 0; i < bluePaddleBox.children.length; i += 1) {
        bluePaddleBox.children[i].material.color.set(0x00ffff);
      }
      bluePaddleHit = 2;
    } else if (bluePaddleHit >= 2 && bluePaddleHit < 10) {
      bluePaddleHit += 1;
    } else if (bluePaddleHit === 10) {
      for (let i = 0; i < bluePaddleBox.children.length; i += 1) {
        bluePaddleBox.children[i].material.color.set(0x0000ff);
      }
      bluePaddleHit = 0;
    }
  }

  function wallHitChangeColor() {
    if (topWallHit === 1) {
      topPlane.material.color.set(0x7986cb);
      topWallHit = 2;
    } else if (topWallHit >= 2 && topWallHit < 10) {
      topWallHit += 1;
    } else if (topWallHit === 10) {
      topPlane.material.color.set(0x1f023c);
      topWallHit = 0;
    }
    if (bottomWallHit === 1) {
      bottomPlane.material.color.set(0x7986cb);
      bottomWallHit = 2;
    } else if (bottomWallHit >= 2 && bottomWallHit < 10) {
      bottomWallHit += 1;
    } else if (bottomWallHit === 10) {
      bottomPlane.material.color.set(0x1f023c);
      bottomWallHit = 0;
    }
    if (rightWallHit === 1) {
      rightPlane.material.color.set(0x7986cb);
      rightWallHit = 2;
    } else if (rightWallHit >= 2 && rightWallHit < 10) {
      rightWallHit += 1;
    } else if (rightWallHit === 10) {
      rightPlane.material.color.set(0x1f023c);
      rightWallHit = 0;
    }
    if (leftWallHit === 1) {
      leftPlane.material.color.set(0x7986cb);
      leftWallHit = 2;
    } else if (leftWallHit >= 2 && leftWallHit < 10) {
      leftWallHit += 1;
    } else if (leftWallHit === 10) {
      leftPlane.material.color.set(0x1f023c);
      leftWallHit = 0;
    }
  }

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

  let a = 0.1;
  let b = 0.1;
  let c = 0.1;
  const v = 1.5;
  let start = 1;

  function render() {
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }
    if (ball) {
      if (start === 1) {
        ball.position.set(0, Math.random() * 8 - 4, Math.random() * 12 - 6);
        start = 0;
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
        if (ball.position.x > 19.5 && ball.position.x < 20.5) {
          if (!checkPaddleHit('red')) {
            start = 1;
          } else {
            a *= -1;
            redPaddleHit = 1;
          }
        }
        if (ball.position.x < -19.5 && ball.position.x > -20.5) {
          if (!checkPaddleHit('blue')) {
            start = 1;
          } else {
            a *= -1;
            bluePaddleHit = 1;
          }
        }

        // 벽에 부딪히면 방향 바꾸기
        if (ball.position.z < -7 && ball.position.z > -8) {
          c *= -1;
          leftWallHit = 1;
        }
        if (ball.position.z > 7 && ball.position.z < 8) {
          c *= -1;
          rightWallHit = 1;
        }
        if (ball.position.y > 4.5 && ball.position.y < 5.5) {
          b *= -1;
          topWallHit = 1;
        }
        if (ball.position.y < -4.5 && ball.position.y > -5.5) {
          b *= -1;
          bottomWallHit = 1;
        }
        paddleHitChangeColor();
        wallHitChangeColor();
      }
    }

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

export default game;
