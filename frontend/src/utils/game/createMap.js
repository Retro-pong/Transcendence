import * as THREE from 'three';

function createMap(scene) {
  const map = new THREE.Object3D();
  scene.add(map);

  const mapBoxGeometry = new THREE.BoxGeometry(50, 10, 10, 4, 0, 4);
  const mapBoxMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true,
  });
  const mapBox = new THREE.Mesh(mapBoxGeometry, mapBoxMaterial);
  mapBox.position.set(0, 0, 0);
  const mapBoxGeometry2 = new THREE.BoxGeometry(50, 10, 10, 4, 4, 0);
  const mapBoxMaterial2 = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true,
    reflectivity: 1,
  });
  const mapBox2 = new THREE.Mesh(mapBoxGeometry2, mapBoxMaterial2);
  mapBox.position.set(0, 0, 0);

  map.add(mapBox);
  map.add(mapBox2);

  mapBox.name = 'mapBox';
  mapBox2.name = 'mapBox2';

  return map;
}

export default createMap;
