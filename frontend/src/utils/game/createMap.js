import * as THREE from 'three';

function createMap(scene, controls) {
  // const mapGeometry = new THREE.BoxGeometry(50, 10, 15, 4, 4, 4);
  // const mapMaterial = new THREE.MeshBasicMaterial({
  //   color: 0x00ff00,
  //   wireframe: true,
  // });
  // const map = new THREE.Mesh(mapGeometry, mapMaterial);

  const planeX = 40;
  const planeY = 10;
  const planeZ = 15;
  // 앞 뒤
  const planeGeometryX = new THREE.PlaneGeometry(planeX, planeY);
  // 좌 우
  const planeGeometryY = new THREE.PlaneGeometry(planeY, planeZ);
  // 상 하
  const planeGeometryZ = new THREE.PlaneGeometry(planeZ, planeX);
  const planeMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.5,
  });
  const planes = [];
  for (let i = 0; i < 2; i += 1) {
    planes.push(new THREE.Mesh(planeGeometryX, planeMaterial));
    planes.push(new THREE.Mesh(planeGeometryY, planeMaterial));
    planes.push(new THREE.Mesh(planeGeometryZ, planeMaterial));
  }

  // Position the planes to form a cube
  planes[0].position.set(0, 0, planeZ / 2); // front
  planes[3].position.set(0, 0, -planeZ / 2); // back
  planes[3].rotation.y = Math.PI;

  planes[1].position.set(planeX / 2, 0, 0); // right
  planes[1].rotation.x = Math.PI / 2;
  planes[1].rotation.y = Math.PI / 2;

  planes[4].position.set(-planeX / 2, 0, 0); // left
  planes[4].rotation.x = Math.PI / 2;
  planes[4].rotation.y = -Math.PI / 2;

  planes[2].position.set(0, planeY / 2, 0); // top
  planes[2].rotation.x = -Math.PI / 2;
  planes[2].rotation.z = -Math.PI / 2;

  planes[5].position.set(0, -planeY / 2, 0); // bottom
  planes[5].rotation.x = Math.PI / 2;
  planes[5].rotation.z = -Math.PI / 2;

  const map = new THREE.Group();
  planes.forEach((plane) => {
    map.add(plane);
  });

  map.position.set(0, 0, 0);
  map.name = 'map';
  scene.add(map);

  const box3 = new THREE.Box3().setFromObject(map);
  const boxCenter = new THREE.Vector3();
  box3.getCenter(boxCenter);

  controls.maxDistance = box3.getSize(new THREE.Vector3()).length();
  controls.minDistance = 20;

  controls.target.copy(boxCenter);
  controls.update();
}

export default createMap;
