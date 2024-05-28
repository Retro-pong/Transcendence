import * as THREE from 'three';

function createGameObject(scene) {
  const gameObjs = new THREE.Object3D();
  scene.add(gameObjs);

  // ball
  const ballGeometry = new THREE.SphereGeometry(1, 32, 16);
  const ballMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff });
  const ball = new THREE.Mesh(ballGeometry, ballMaterial);
  ball.position.set(0, 0, 0);
  ball.name = 'ball';
  gameObjs.add(ball);

  // ballPlane
  const planeY = 10;
  const planeZ = 15;
  const lineWidth = 0.5;

  const lineGeometry1 = new THREE.BoxGeometry(
    lineWidth,
    planeY + lineWidth,
    lineWidth
  );
  const lineGeometry2 = new THREE.BoxGeometry(
    lineWidth,
    planeY + lineWidth,
    lineWidth
  );
  const lineGeometry3 = new THREE.BoxGeometry(
    lineWidth,
    lineWidth,
    planeZ + lineWidth
  );
  const lineGeometry4 = new THREE.BoxGeometry(
    lineWidth,
    lineWidth,
    planeZ + lineWidth
  );
  const ballPlaneMaterial = new THREE.MeshBasicMaterial({
    color: 0x9bfab6,
    opacity: 1,
  });

  const ballPlaneLine1 = new THREE.Mesh(lineGeometry1, ballPlaneMaterial);
  const ballPlaneLine2 = new THREE.Mesh(lineGeometry2, ballPlaneMaterial);
  const ballPlaneLine3 = new THREE.Mesh(lineGeometry3, ballPlaneMaterial);
  const ballPlaneLine4 = new THREE.Mesh(lineGeometry4, ballPlaneMaterial);

  ballPlaneLine1.position.z = planeZ / 2;
  ballPlaneLine2.position.z = -planeZ / 2;
  ballPlaneLine3.position.y = planeY / 2;
  ballPlaneLine4.position.y = -planeY / 2;

  ballPlaneLine1.rotation.y = Math.PI / 2;
  ballPlaneLine2.rotation.y = Math.PI / 2;
  ballPlaneLine3.rotation.z = Math.PI / 2;
  ballPlaneLine4.rotation.z = Math.PI / 2;

  const ballPlane = new THREE.Group();
  ballPlane.add(ballPlaneLine1);
  ballPlane.add(ballPlaneLine2);
  ballPlane.add(ballPlaneLine3);
  ballPlane.add(ballPlaneLine4);

  ballPlane.position.set(0, 0, 0);
  ballPlane.name = 'ballPlane';
  scene.getObjectByName('map').add(ballPlane);

  // paddle
  const paddleWidth = 0.5;
  const paddleHeight = 3;
  const paddleDepth = paddleHeight * 1.5;

  const paddleGeometry = new THREE.BoxGeometry(
    paddleWidth,
    paddleHeight,
    paddleDepth
  );
  const paddleMaterial = new THREE.MeshBasicMaterial({
    color: 0xa0a0a0,
    transparent: true,
    opacity: 0.7,
  });
  const redPaddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
  const bluePaddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
  redPaddle.position.set(20, 0, 0);
  bluePaddle.position.set(-20, 0, 0);

  // paddle 내부, 테두리
  const bluePaddleBox = new THREE.Group();
  const redPaddleBox = new THREE.Group();

  const paddleBorder = (type) => {
    return new THREE.BoxGeometry(
      paddleWidth,
      type === 'horizontal' ? paddleWidth - paddleWidth / 2 : paddleHeight,
      type === 'horizontal' ? paddleDepth : paddleWidth - paddleWidth / 2
    );
  };

  const paddleInner = (type) => {
    return new THREE.BoxGeometry(
      paddleWidth,
      type === 'horizontal' ? paddleWidth / 2 : paddleHeight / 3,
      type === 'horizontal' ? paddleDepth / 3 : paddleWidth / 2
    );
  };

  const paddleBorderMaterial = (color) => {
    return new THREE.MeshBasicMaterial({
      color: color === 'blue' ? 0x00ffff : 0xb6226d,
      opacity: 0.8,
    });
  };

  const border = [
    {
      name: 'top',
      mesh: paddleBorder('horizontal'),
      position: { x: 0, y: paddleHeight / 2 - paddleWidth / 4, z: 0 },
    },
    {
      name: 'bottom',
      mesh: paddleBorder('horizontal'),
      position: { x: 0, y: -paddleHeight / 2 + paddleWidth / 4, z: 0 },
    },
    {
      name: 'left',
      mesh: paddleBorder('vertical'),
      position: { x: 0, y: 0, z: paddleDepth / 2 - paddleWidth / 4 },
    },
    {
      name: 'right',
      mesh: paddleBorder('vertical'),
      position: { x: 0, y: 0, z: -paddleDepth / 2 + paddleWidth / 4 },
    },
    {
      name: 'innerTop',
      mesh: paddleInner('vertical'),
      position: { x: 0, y: paddleHeight / 3, z: 0 },
    },
    {
      name: 'innerBottom',
      mesh: paddleInner('vertical'),
      position: { x: 0, y: -paddleHeight / 3, z: 0 },
    },
    {
      name: 'innerLeft',
      mesh: paddleInner('horizontal'),
      position: { x: 0, y: 0, z: paddleDepth / 3 },
    },
    {
      name: 'innerRight',
      mesh: paddleInner('horizontal'),
      position: { x: 0, y: 0, z: -paddleDepth / 3 },
    },
    {
      name: 'boxTop',
      mesh: paddleInner('horizontal'),
      position: { x: 0, y: paddleHeight / 6, z: 0 },
    },
    {
      name: 'boxBottom',
      mesh: paddleInner('horizontal'),
      position: { x: 0, y: -paddleHeight / 6, z: 0 },
    },
    {
      name: 'boxLeft',
      mesh: paddleInner('vertical'),
      position: { x: 0, y: 0, z: paddleDepth / 6 },
    },
    {
      name: 'boxRight',
      mesh: paddleInner('vertical'),
      position: { x: 0, y: 0, z: -paddleDepth / 6 },
    },
  ];

  border.forEach((border) => {
    const mesh = new THREE.Mesh(border.mesh, paddleBorderMaterial('blue'));
    mesh.position.set(border.position.x, border.position.y, border.position.z);
    bluePaddleBox.add(mesh);
  });

  redPaddleBox.copy(bluePaddleBox);
  for (let i = 0; i < redPaddleBox.children.length; i += 1) {
    redPaddleBox.children[i].material = paddleBorderMaterial('red');
  }

  bluePaddle.add(bluePaddleBox);
  redPaddle.add(redPaddleBox);

  redPaddle.name = 'redPaddle';
  bluePaddle.name = 'bluePaddle';
  gameObjs.add(redPaddle);
  gameObjs.add(bluePaddle);
}

export default createGameObject;
