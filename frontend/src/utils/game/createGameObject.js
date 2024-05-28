import * as THREE from 'three';

function createGameObject(scene) {
  const gameObjs = new THREE.Object3D();
  scene.add(gameObjs);

  const ballGeometry = new THREE.SphereGeometry(1, 32, 16);
  const ballMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff });
  const ball = new THREE.Mesh(ballGeometry, ballMaterial);
  ball.position.set(0, 0, 0);

  const planeY = 10;
  const planeZ = 15;

  const lines = [
    [new THREE.Vector3(0, planeY / 2, -planeZ / 2),
    new THREE.Vector3(0, planeY / 2, planeZ / 2)],
    [new THREE.Vector3(0, planeY / 2, planeZ / 2),
    new THREE.Vector3(0, -planeY / 2, planeZ / 2)],
    [new THREE.Vector3(0, -planeY / 2, planeZ / 2),
    new THREE.Vector3(0, -planeY / 2, -planeZ / 2)],
    [new THREE.Vector3(0, -planeY / 2, -planeZ / 2),
    new THREE.Vector3(0, planeY / 2, -planeZ / 2)],
  ];

  const lineWidth = 0.5;
  const lineGeometry1 = new THREE.BoxGeometry(lineWidth, planeY + lineWidth, lineWidth);
  const lineGeometry2 = new THREE.BoxGeometry(lineWidth, planeY + lineWidth, lineWidth);
  const lineGeometry3 = new THREE.BoxGeometry(lineWidth, lineWidth, planeZ + lineWidth);
  const lineGeometry4 = new THREE.BoxGeometry(lineWidth, lineWidth, planeZ + lineWidth);
  const ballPlaneMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff, opacity: 0.5});

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

  const redPaddleGeometry = new THREE.BoxGeometry(0.5, 3, 3);
  const redPaddleMaterial = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    transparent: true,
    opacity: 0.7,
  });
  const redPaddle = new THREE.Mesh(redPaddleGeometry, redPaddleMaterial);
  redPaddle.position.set(20, 0, 0);

  const bluePaddleGeometry = new THREE.BoxGeometry(0.5, 3, 3);
  const bluePaddleMaterial = new THREE.MeshBasicMaterial({
    color: 0x0000ff,
    transparent: true,
    opacity: 0.7,
  });
  const bluePaddle = new THREE.Mesh(bluePaddleGeometry, bluePaddleMaterial);
  bluePaddle.position.set(-20, 0, 0);

  ball.name = 'ball';
  redPaddle.name = 'redPaddle';
  bluePaddle.name = 'bluePaddle';
  gameObjs.add(ball);
  gameObjs.add(redPaddle);
  gameObjs.add(bluePaddle);
}

export default createGameObject;
