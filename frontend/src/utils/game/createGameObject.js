import * as THREE from 'three';

function createGameObject(scene) {
  const gameObjs = new THREE.Object3D();
  scene.add(gameObjs);

  const ballGeometry = new THREE.SphereGeometry(1, 32, 16);
  const ballMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff });
  const ball = new THREE.Mesh(ballGeometry, ballMaterial);
  ball.position.set(0, 0, 0);

  const ballPlaneGeometry = new THREE.PlaneGeometry(15, 10);
  const ballPlaneMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    transparent: true,
    opacity: 0.3,
  });
  ballPlaneMaterial.side = THREE.DoubleSide;
  const ballPlane = new THREE.Mesh(ballPlaneGeometry, ballPlaneMaterial);
  ballPlane.rotation.y = Math.PI / 2;
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
