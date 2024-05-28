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
    color: 0x0000ff,
    opacity: 0.5,
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
    opacity: 0.5,
  });
  const redPaddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
  const bluePaddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
  redPaddle.position.set(20, 0, 0);
  bluePaddle.position.set(-20, 0, 0);

  // paddle 내부, 테두리
  const paddleLineWidth = 0.3;
  const bluePaddleBox = new THREE.Group();
  const redPaddleBox = new THREE.Group();

  const paddleBorder = (type) => {
    return new THREE.BoxGeometry(
      paddleWidth,
      type === 'horizontal'
        ? paddleWidth - paddleLineWidth
        : paddleHeight + paddleWidth - paddleLineWidth,
      type === 'horizontal'
        ? paddleDepth + paddleWidth - paddleLineWidth
        : paddleWidth - paddleLineWidth
    );
  };

  const paddleInner = (type) => {
    return new THREE.BoxGeometry(
      paddleWidth,
      type === 'horizontal' ? paddleWidth - paddleLineWidth : paddleHeight / 3,
      type === 'horizontal' ? paddleDepth / 3 : paddleWidth - paddleLineWidth
    );
  };

  const paddleBorderMaterial = (color) => {
    return new THREE.MeshBasicMaterial({
      color: color === 'blue' ? 0x00ff : 0xff0000,
      opacity: 0.8,
    });
  };

  const border = {
    top: new THREE.Mesh(
      paddleBorder('horizontal'),
      paddleBorderMaterial('blue')
    ),
    bottom: new THREE.Mesh(
      paddleBorder('horizontal'),
      paddleBorderMaterial('blue')
    ),
    left: new THREE.Mesh(
      paddleBorder('vertical'),
      paddleBorderMaterial('blue')
    ),
    right: new THREE.Mesh(
      paddleBorder('vertical'),
      paddleBorderMaterial('blue')
    ),
  };

  const inner = {
    top: new THREE.Mesh(paddleInner('vertical'), paddleBorderMaterial('blue')),
    bottom: new THREE.Mesh(
      paddleInner('vertical'),
      paddleBorderMaterial('blue')
    ),
    left: new THREE.Mesh(
      paddleInner('horizontal'),
      paddleBorderMaterial('blue')
    ),
    right: new THREE.Mesh(
      paddleInner('horizontal'),
      paddleBorderMaterial('blue')
    ),
    boxTop: new THREE.Mesh(
      paddleInner('horizontal'),
      paddleBorderMaterial('blue')
    ),
    boxBottom: new THREE.Mesh(
      paddleInner('horizontal'),
      paddleBorderMaterial('blue')
    ),
    boxLeft: new THREE.Mesh(
      paddleInner('vertical'),
      paddleBorderMaterial('blue')
    ),
    boxRight: new THREE.Mesh(
      paddleInner('vertical'),
      paddleBorderMaterial('blue')
    ),
  };

  border.top.position.set(0, paddleHeight / 2, 0);
  border.bottom.position.set(0, -paddleHeight / 2, 0);
  border.left.position.set(0, 0, paddleDepth / 2);
  border.right.position.set(0, 0, -paddleDepth / 2);

  inner.top.position.set(0, paddleHeight / 3, 0);
  inner.bottom.position.set(0, -paddleHeight / 3, 0);
  inner.left.position.set(0, 0, paddleDepth / 3);
  inner.right.position.set(0, 0, -paddleDepth / 3);

  inner.boxTop.position.set(0, paddleHeight / 6, 0);
  inner.boxBottom.position.set(0, -paddleHeight / 6, 0);
  inner.boxLeft.position.set(0, 0, paddleDepth / 6);
  inner.boxRight.position.set(0, 0, -paddleDepth / 6);

  for (let i = 0; i < Object.values(inner).length; i += 1) {
    const obj = Object.values(inner)[i];
    bluePaddleBox.add(obj);
  }
  for (let i = 0; i < Object.values(border).length; i += 1) {
    const obj = Object.values(border)[i];
    bluePaddleBox.add(obj);
  }

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
