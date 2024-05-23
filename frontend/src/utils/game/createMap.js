import * as THREE from 'three';

function createMap(scene) {
  const mapBoxGeometry = new THREE.BoxGeometry(50, 10, 10, 5, 0, 5);
  const mapBoxMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true,
  });
  const mapBox = new THREE.Mesh(mapBoxGeometry, mapBoxMaterial);
  mapBox.position.set(0, 0, 0);
  const mapBoxGeometry2 = new THREE.BoxGeometry(50, 10, 10, 5, 5, 0);
  const mapBoxMaterial2 = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true,
  });
  const mapBox2 = new THREE.Mesh(mapBoxGeometry2, mapBoxMaterial2);
  mapBox.position.set(0, 0, 0);
  scene.add(mapBox);
  scene.add(mapBox2);

  const ballGeometry = new THREE.SphereGeometry(1, 32, 16);
  const ballMaterial = new THREE.MeshPhongMaterial({ color: 0x00ffff });
  const ball = new THREE.Mesh(ballGeometry, ballMaterial);
  ball.position.set(0, 0, 0);
  scene.add(ball);
}

export default createMap;
