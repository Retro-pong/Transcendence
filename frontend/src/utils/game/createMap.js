import * as THREE from 'three';

function createMap(scene, controls) {
  const mapGeometry = new THREE.BoxGeometry(50, 10, 15, 4, 4, 4);
  const mapMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true,
  });
  const map = new THREE.Mesh(mapGeometry, mapMaterial);

  map.position.set(0, 0, 0);

  map.add(map);

  map.name = 'map';

  const box3 = new THREE.Box3().setFromObject(map);
  const boxCenter = new THREE.Vector3();
  box3.getCenter(boxCenter);

  controls.maxDistance = box3.getSize(new THREE.Vector3()).length();
  controls.minDistance = 20;

  controls.target.copy(boxCenter);
  controls.update();
}

export default createMap;
