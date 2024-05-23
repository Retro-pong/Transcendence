import * as THREE from 'three';

function createGameObject(scene) {
  const gameObjs = new THREE.Object3D();
  scene.add(gameObjs);

  const ballGeometry = new THREE.SphereGeometry(1, 32, 16);
  const ballMaterial = new THREE.MeshPhongMaterial({ color: 0x00ffff });
  const ball = new THREE.Mesh(ballGeometry, ballMaterial);
  ball.position.set(0, 0, 0);

  const redPaddleGeometry = new THREE.BoxGeometry(0.5, 3, 3);
  const redPaddleMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
  const redPaddle = new THREE.Mesh(redPaddleGeometry, redPaddleMaterial);
  redPaddle.position.set(25, 0, 0);

  const bluePaddleGeometry = new THREE.BoxGeometry(0.5, 3, 3);
  const bluePaddleMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff });
  const bluePaddle = new THREE.Mesh(bluePaddleGeometry, bluePaddleMaterial);
  bluePaddle.position.set(-25, 0, 0);

  gameObjs.add(ball);
  gameObjs.add(redPaddle);
  gameObjs.add(bluePaddle);

  return { ball, redPaddle, bluePaddle };
}

export default createGameObject;
