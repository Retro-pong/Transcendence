import * as THREE from 'three';

function createMap(scene, controls) {
  const map = new THREE.Object3D();
  scene.add(map);

  const mapBoxGeometry = new THREE.BoxGeometry(50, 10, 10, 4, 4, 4);
  const mapBoxMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true,
  });
  const mapBox = new THREE.Mesh(mapBoxGeometry, mapBoxMaterial);

  mapBox.position.set(0, 0, 0);

  map.add(mapBox);

  mapBox.name = 'mapBox';

  const box3 = new THREE.Box3().setFromObject(mapBox);
  const boxCenter = new THREE.Vector3();
  box3.getCenter(boxCenter);

  controls.maxDistance = box3.getSize(new THREE.Vector3()).length();
  controls.minDistance = 20;

  controls.target.copy(boxCenter);
  controls.update();
}

export default createMap;
