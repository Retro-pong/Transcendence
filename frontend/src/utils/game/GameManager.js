import * as THREE from 'three';
import cameraSetting from '@/utils/game/setting/cameraSetting';
import sceneSetting from '@/utils/game/setting/sceneSetting';
import createMap from '@/utils/game/setting/createMap';
import createGameObject from '@/utils/game/setting/createGameObject';
import localEventHandler from '@/utils/game/eventHandler/localEventHandler';
import resizeRendererToDisplaySize from '@/utils/game/render/resizeRendererToDisplaySize';
import localGame from '@/utils/game/localGame';
import rendering from '@/utils/game/render/rendering';
import multiEventHandler from '@/utils/game/eventHandler/multiEventHandler';
import hitChangeColor from '@/utils/game/utils/hitChangeColor';

class GameManager {
  constructor() {
    this.scene = new THREE.Scene();
    this.canvas = document.getElementById('gameCanvas');
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.camera = null;

    this.mapList = {
      horizon: '/img/map_futuristic_horizon.jpg',
      mountain: '/img/map_mountain.jpg',
      pixel: '/img/map_pixel_rain.jpg',
    };

    this.loader = new THREE.TextureLoader();
    this.loader.load(this.mapList.horizon, function (texture) {
      this.scene.background = texture;
    });

    sceneSetting(this.scene);
    createMap(this.scene);
    createGameObject(this.scene, '0x0000ff');

    this.objects = {
      ball: this.scene.getObjectByName('ball'),
      ballPlane: this.scene.getObjectByName('ballPlane'),
      redPaddle: this.scene.getObjectByName('redPaddle'),
      bluePaddle: this.scene.getObjectByName('bluePaddle'),
      redPlayerScore: document.getElementById('player1Score'),
      bluePlayerScore: document.getElementById('player2Score'),
    };

    this.localGameInfo = null;
    this.multiGameInfo = null;
  }

  localGameSetting() {
    this.camera = cameraSetting('local', '');
    localEventHandler(this.canvas, this.scene, this.camera);
    this.localGameInfo = {
      a: 0,
      b: 0,
      c: 0,
      v: 2.2,
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
  }

  multiGameSetting(data) {
    this.camera = cameraSetting('multi', data.side);
    multiEventHandler(this.canvas, this.scene, this.camera);
    this.loader.load(this.mapList[data.map], function (texture) {
      this.scene.background = texture;
    });
    this.objects.ball.material.color.set(data.ball_color);
    this.objects.ball.position.set(data.ball.x, data.ball.y, data.ball.z);
    this.objects.redPaddle.position.set(20, data.redY, data.redZ);
    this.objects.bluePaddle.position.set(-20, data.blueY, data.blueZ);
    this.multiGameInfo = {
      redPaddleHit: 10,
      bluePaddleHit: 10,
      topWallHit: 10,
      bottomWallHit: 10,
      rightWallHit: 10,
      leftWallHit: 10,
    };
  }

  localGameStart() {
    function render() {
      if (resizeRendererToDisplaySize(this.renderer)) {
        const canvas = this.renderer.domElement;
        let aspect;
        if (this.camera.red && this.camera.blue) {
          aspect = canvas.clientWidth / 2 / canvas.clientHeight;
          this.camera.blue.aspect = aspect;
          this.camera.blue.updateProjectionMatrix();
          this.camera.red.aspect = aspect;
          this.camera.red.updateProjectionMatrix();
        }
      }
      this.localGameInfo = localGame(
        this.scene,
        this.objects,
        this.localGameInfo
      );
      rendering(this.renderer, this.scene, this.camera, 'local');
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  }

  multiGameStart() {
    function render() {
      if (resizeRendererToDisplaySize(this.renderer)) {
        const canvas = this.renderer.domElement;
        let aspect;
        if (this.camera.multi) {
          aspect = canvas.clientWidth / canvas.clientHeight;
          this.camera.multi.aspect = aspect;
          this.camera.multi.updateProjectionMatrix();
        }
      }
      rendering(this.renderer, this.scene, this.camera, 'multi');
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  }

  multiGameUpdateObjects(data) {
    if (
      parseInt(data.redScore, 10).toString() !==
      this.objects.redPlayerScore.innerText
    ) {
      document.getElementById('player1Score').innerText = parseInt(
        data.redScore,
        10
      ).toString();
    }
    if (
      parseInt(data.blueScore, 10).toString() !==
      this.objects.bluePlayerScore.innerText
    ) {
      document.getElementById('player2Score').innerText = parseInt(
        data.blueScore,
        10
      ).toString();
    }

    this.objects.redPaddle.position.set(-20, data.redY, data.redZ);
    this.objects.bluePaddle.position.set(20, data.blueY, data.blueZ);
    this.objects.ball.position.set(data.ballX, data.ballY, data.ballZ);

    switch (parseInt(data.ballHit, 10)) {
      case 1:
        this.multiGameInfo.redPaddleHit = 1;
        break;
      case 2:
        this.multiGameInfo.bluePaddleHit = 1;
        break;
      case 3:
        this.multiGameInfo.leftWallHit = 1;
        break;
      case 4:
        this.multiGameInfo.rightWallHit = 1;
        break;
      case 5:
        this.multiGameInfo.topWallHit = 1;
        break;
      case 6:
        this.multiGameInfo.bottomWallHit = 1;
        break;
      default:
        break;
    }
    this.multiGameInfo = hitChangeColor(this.multiGameInfo, this.scene);
  }
}

export default GameManager;
