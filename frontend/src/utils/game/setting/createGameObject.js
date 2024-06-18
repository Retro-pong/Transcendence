import * as THREE from 'three';

function createGameObject(scene, ballColor) {
  const gameObjs = new THREE.Object3D();
  scene.add(gameObjs);

  // ball
  const ballGeometry = new THREE.SphereGeometry(1, 32, 16);
  const ballMaterial = new THREE.MeshPhongMaterial({
    color: ballColor,
    shininess: 100,
  });

  const ball = new THREE.Mesh(ballGeometry, ballMaterial);
  ball.position.set(0, 0, 0);
  ball.name = 'ball';
  gameObjs.add(ball);

  // ballPlane
  const ballPlane = new THREE.Group();
  const planeY = 10;
  const planeZ = 15;
  const lineWidth = 0.5;

  const ballPlaneMaterial = new THREE.MeshBasicMaterial({
    color: 0x9bfab6,
    transparent: true,
    opacity: 0.6,
  });
  const ballPlanes = [
    {
      w: lineWidth,
      h: planeY + lineWidth,
      d: lineWidth,
      position: { x: 0, y: 0, z: planeZ / 2 },
      rotation: { x: 0, y: 0, z: 0 },
    },
    {
      w: lineWidth,
      h: planeY + lineWidth,
      d: lineWidth,
      position: { x: 0, y: 0, z: -planeZ / 2 },
      rotation: { x: 0, y: 0, z: 0 },
    },
    {
      w: lineWidth,
      h: lineWidth,
      d: planeZ + lineWidth,
      position: { x: 0, y: planeY / 2, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
    },
    {
      w: lineWidth,
      h: lineWidth,
      d: planeZ + lineWidth,
      position: { x: 0, y: -planeY / 2, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
    },
  ];

  ballPlanes.forEach((plane) => {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(plane.w, plane.h, plane.d),
      ballPlaneMaterial
    );
    mesh.position.set(plane.position.x, plane.position.y, plane.position.z);
    mesh.rotation.set(plane.rotation.x, plane.rotation.y, plane.rotation.z);
    ballPlane.add(mesh);
  });

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
    opacity: 0.5,
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
      paddleWidth + 0.05,
      type === 'horizontal'
        ? paddleWidth - paddleWidth + 0.8 / 2
        : paddleHeight + 0.05,
      type === 'horizontal'
        ? paddleDepth + 0.05
        : paddleWidth - paddleWidth / 2 + 0.05
    );
  };
  const paddleInner = (type) => {
    return new THREE.BoxGeometry(
      paddleWidth + 0.05,
      type === 'horizontal' ? paddleWidth / 2 + 0.05 : paddleHeight / 3 + 0.05,
      type === 'horizontal' ? paddleDepth / 3 + 0.05 : paddleWidth / 2 + 0.05
    );
  };

  const paddleBorderMaterial = (color) => {
    return new THREE.MeshBasicMaterial({
      color: color === 'blue' ? 0x0000ff : 0xff0000,
      opacity: 1,
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

  bluePaddleBox.name = 'bluePaddleBox';
  redPaddleBox.name = 'redPaddleBox';
  bluePaddle.add(bluePaddleBox);
  redPaddle.add(redPaddleBox);

  redPaddle.name = 'redPaddle';
  bluePaddle.name = 'bluePaddle';
  gameObjs.add(redPaddle);
  gameObjs.add(bluePaddle);
}

export default createGameObject;
