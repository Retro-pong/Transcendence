import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

function game() {
  const canvas = document.getElementById('gameCanvas');
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

  const fov = 45;
  const aspect = 2; // the canvas default
  const near = 0.1;
  const far = 1000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 1, 2);

  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 5, 0);
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

  let table;
  let redPaddle;
  let bluePaddle;
  let ball;
  {
    const gltfLoader = new GLTFLoader();
    gltfLoader.load('/object/tablePing.gltf', (gltf) => {
      const root = gltf.scene;
      scene.add(root);

      // compute the box that contains all the stuff
      // from root and below
      const box = new THREE.Box3().setFromObject(root);

      const boxSize = box.getSize(new THREE.Vector3()).length();
      const boxCenter = box.getCenter(new THREE.Vector3());

      // update the Trackball controls to handle the new size
      controls.maxDistance = boxSize;
      controls.target.copy(boxCenter);
      controls.update();

      table = root.getObjectByName('table');
      redPaddle = root.getObjectByName('red_paddle');
      bluePaddle = root.getObjectByName('blue_paddle');
      ball = root.getObjectByName('ball');
    });
  }

  {
    canvas.addEventListener('keydown', (e) => {
      console.log(e.key);

      // 시점 변경
      if (e.key === '1') {
        camera.position.set(-2.16, 0.6, 0);
        controls.update();
      }
      if (e.key === '2') {
        camera.position.set(2.16, 0.6, 0);
        controls.update();
      }

      if (e.key === 'a') {
        if (bluePaddle) {
          if (bluePaddle.position.z < 0.8) {
            bluePaddle.position.z += 0.05;
          }
        }
      }
      if (e.key === 'd') {
        if (bluePaddle) {
          if (bluePaddle.position.z > -0.8) {
            bluePaddle.position.z -= 0.05;
          }
        }
      }
      if (e.key === 'w') {
        if (bluePaddle) {
          if (bluePaddle.position.y < 0.3) {
            bluePaddle.position.y += 0.05;
          }
        }
      }
      if (e.key === 's') {
        if (bluePaddle) {
          if (bluePaddle.position.y > 0.12) {
            bluePaddle.position.y -= 0.05;
          }
        }
      }
    });

    canvas.addEventListener('mousemove', (e) => {
      if (redPaddle) {
        // 1번 시점 y축
        const mouseY = (e.clientY / canvas.height) * 2;
        if (mouseY > 0.7) {
          redPaddle.position.y = 0;
        } else if (mouseY < 0.2) {
          redPaddle.position.y = 0.5;
        } else {
          redPaddle.position.y = -mouseY + 0.7;
        }

        // 1번 시점 x축
        const mouseX = (e.clientX / canvas.width) * 2;
        if (mouseX < 0.2) {
          redPaddle.position.z = -0.6;
        } else if (mouseX > 0.8) {
          redPaddle.position.z = 0.6;
        } else {
          redPaddle.position.z = 2 * mouseX - 1;
        }
      }
    });
  }

  let redPaddleSet = false;
  let bluePaddleSet = false;
  let ballSet = false;

  function initSettings() {
    if (redPaddleSet && bluePaddleSet && ballSet) {
      return;
    }

    if (redPaddle && !redPaddleSet) {
      redPaddle.position.x = -1.2;
      redPaddle.position.y = 0.12;
      redPaddle.rotation.y = Math.PI / 2;
      redPaddle.rotation.z = Math.PI / 2;
      redPaddleSet = true;
    }

    if (bluePaddle && !bluePaddleSet) {
      bluePaddle.position.x = 1.2;
      bluePaddle.position.y = 0.1;
      bluePaddle.rotation.y = Math.PI / 2;
      bluePaddle.rotation.z = Math.PI / 2;
      bluePaddleSet = true;
    }

    if (ball && !ballSet) {
      ballSet = true;
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

  function render(time) {
    time *= 0.001;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    initSettings();

    if (ball && ballSet) {
      ball.position.x = Math.sin(time) * 0.5;
    }
    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

export default game;
