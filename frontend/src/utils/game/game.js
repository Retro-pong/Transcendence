import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import createMap from './createMap';
import createGameObject from '@/utils/game/createGameObject';
import eventHandler from '@/utils/game/eventHandler';

function game() {
  const canvas = document.getElementById('gameCanvas');
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

  const fov = 45;
  const aspect = 2; // the canvas default
  const near = 0.1;
  const far = 1000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(-40, 0, 0);

  const controls = new OrbitControls(camera, canvas);
  // controls.target.set(0, 0, 0);
  controls.update();

  const scene = new THREE.Scene();

  // 배경 이미지
  // const loader = new THREE.TextureLoader();
  // loader.load('/img/map_pixel_rain.jpg', function (texture) {
  //   scene.background = texture;
  // });
  scene.background = new THREE.Color(0x000000);

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
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(5, 10, 2);
    scene.add(light);
    scene.add(light.target);
  }

  createMap(scene, controls);
  createGameObject(scene);
  eventHandler(canvas, scene, camera, renderer, controls);

  const map = scene.getObjectByName('map');
  const ball = scene.getObjectByName('ball');
  const redPaddle = scene.getObjectByName('redPaddle');
  const bluePaddle = scene.getObjectByName('bluePaddle');

  // // 첫 번째 점과 두 번째 점 생성
  //   const point1 = new THREE.Vector3(-2, 0, 0);
  //   const point2 = new THREE.Vector3(2, 0, 0);
  // // LineCurve3 생성
  //   const curve = new THREE.LineCurve3(point1, point2);
  // // LineCurve3를 사용하여 곡선을 표현하는 지오메트리 생성
  //   const points = curve.getPoints(50);
  //   const geometry = new THREE.BufferGeometry().setFromPoints(points);
  // // 라인 마테리얼 생성
  //   const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
  // // 라인 생성
  //   const curveObject = new THREE.Line(geometry, material);
  //   scene.add(curveObject);

  let curve;
  let point1;
  let point2;

  let beforeX = 0;
  let beforeY = 0;
  let beforeZ = 0;
  let ballDirection = 0;


  let hitPoint;
  let ratio;

  point1 = new THREE.Vector3(0, 0, 0);
  point2 = new THREE.Vector3(-24, 0, 0);
  curve = new THREE.LineCurve3(point1, point2);

  function hitPaddle() {
    // 공이 파란 패들에 부딪히는 경우
    if (ball.position.x < -23.5) {
      t = 0;
      point1 = new THREE.Vector3(-23.5, ball.position.y, ball.position.z);
      // 부딪친 여부 확인
      hitPoint = checkPaddleHit('blue');
      if (hitPoint === 0) {
        console.log('out!');
        return ;
      }

      ballDirection = 1;
      ratio = ball.position.distanceToSquared(bluePaddle.position);

      if (hitPoint === 1) {
        point2 = new THREE.Vector3(24, 5 * ratio, 7.5 * ratio);
      }
      if (hitPoint === 2) {
        point2 = new THREE.Vector3(24, 5 * ratio, -7.5 * ratio);
      }
      if (hitPoint === 3) {
        point2 = new THREE.Vector3(24, -5 * ratio, -7.5 * ratio);
      }
      if (hitPoint === 4) {
        point2 = new THREE.Vector3(24, -5 * ratio, 7.5 * ratio);
      }
      if (hitPoint === 5) {
        point2 = new THREE.Vector3(
          24,
          (Math.random() * 10 - 5) * ratio,
          (Math.random() * 15 - 7.5) * ratio
        );
      }

      curve = new THREE.LineCurve3(point1, point2);
      beforeX = -23.5;
      beforeY = ball.position.y;
      beforeZ = ball.position.z;
    }
    // 공이 빨간 패들에 부딪히는 경우
    if (ball.position.x > 23.5) {
      t = 0;
      point1 = new THREE.Vector3(23.5, ball.position.y, ball.position.z);
      hitPoint = checkPaddleHit('red');
      if (hitPoint === 0) {
        console.log('out!');
        return;
      }
      ratio = ball.position.distanceToSquared(redPaddle.position);
      ballDirection = -1;
      if (hitPoint === 1) {
        point2 = new THREE.Vector3(-24, 5 * ratio, -7.5 * ratio);
      }
      if (hitPoint === 2) {
        point2 = new THREE.Vector3(-24, 5 * ratio, 7.5 * ratio);
      }
      if (hitPoint === 3) {
        point2 = new THREE.Vector3(-24, -5 * ratio, 7.5 * ratio);
      }
      if (hitPoint === 4) {
        point2 = new THREE.Vector3(-24, -5 * ratio, -7.5 * ratio);
      }
      if (hitPoint === 5) {
        point2 = new THREE.Vector3(
          -24,
          (Math.random() * 10 - 5) * ratio,
          (Math.random() * 15 - 7.5) * ratio
        );
      }
      curve = new THREE.LineCurve3(point1, point2);
      beforeX = 23.5;
      beforeY = ball.position.y;
      beforeZ = ball.position.z;

    }
  }

  // red z +는 왼쪽
  // blue z +는 오른쪽
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
      console.log('hit');
      // 1사분면
      if (by > py && bz > pz) {
        return type === 'blue' ? 1 : 2;
      }
      // 2사분면
      if (by > py && bz < pz) {
        return type === 'blue' ? 2 : 1;
      }
      // 3사분면
      if (by < py && bz < pz) {
        return type === 'blue' ? 3 : 4;
      }
      // 4사분면
      if (by < py && bz > pz) {
        return type === 'blue' ? 4 : 3;
      }
      return 5;
    }
    return 0;
  }

  function hitWall() {
    const bx = ball.position.x;
    const by = ball.position.y;
    const bz = ball.position.z;

    point1 = new THREE.Vector3(bx, by, bz);


    // 시작점이 주어진 경우
    const startPointOnly = new THREE.Vector3(beforeX, beforeY, beforeZ); // 시작점

    // 시작점을 기준으로 끝점 계산
    const direction = curve.getTangentAt(0); // 시작점에서의 방향
    const desiredLength = 80; // 원하는 길이
    const endPoint = startPointOnly
      .clone()
      .add(direction.multiplyScalar(desiredLength));

    // 블루 왼쪽면, 레드 오른쪽면
    if (ball.position.z < -7.4) {
      t = 0;
      point2 = new THREE.Vector3(endPoint.x, endPoint.y, -endPoint.z);
    }
    // 블루 오른쪽면, 레드 왼쪽면
    if (ball.position.z > 7.4) {
      t = 0;
      point2 = new THREE.Vector3(endPoint.x, endPoint.y, -endPoint.z);
    }
    // 위
    if (ball.position.y > 4.9) {
      t = 0;
      point2 = new THREE.Vector3(endPoint.x, -endPoint.y, endPoint.z);
    }
    // 아래
    if (ball.position.y < -4.9) {
      t = 0;
      point2 = new THREE.Vector3(endPoint.x, -endPoint.y, endPoint.z);
    }
    curve = new THREE.LineCurve3(point1, point2);
    beforeX = bx;
    beforeY = by;
    beforeZ = bz;
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

  let t = 0;

  function render() {
    t += 0.005;
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }
    if (ball) {
      if (setCurve === 0) {
        curve = makeBallCurve(

        );
        setCurve = 1;
      } else {
        hit = false;
        point = curve.getPointAt(t);
        ball.position.copy(point);
        hitPaddle();

        if (ball.position.x > 23.5 && ball.position.x < 24.5) {
          t = 0;
          if (hit) {
            curve = makeBallCurve();
          }
        }
      }

    }

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

export default game;
