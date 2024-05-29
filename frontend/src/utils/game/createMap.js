import * as THREE from 'three';

function createMap(scene) {
  const map = new THREE.Group();

  const planeX = 40;
  const planeY = 10;
  const planeZ = 15;
  // paddle 면
  const planeGeometry = new THREE.PlaneGeometry(planeY, planeZ);
  const planeMaterial = new THREE.MeshBasicMaterial({
    color: 0x0000ff,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0,
  });

  const planeRed = new THREE.Mesh(planeGeometry, planeMaterial);
  const planeBlue = new THREE.Mesh(planeGeometry, planeMaterial);

  planeRed.rotation.x = Math.PI / 2;
  planeRed.rotation.y = Math.PI / 2;
  planeBlue.rotation.x = Math.PI / 2;
  planeBlue.rotation.y = Math.PI / 2;
  planeRed.position.set(planeX / 2, 0, 0);
  planeBlue.position.set(-planeX / 2, 0, 0);

  map.add(planeRed);
  map.add(planeBlue);

  // map frame
  const frame = new THREE.Group();
  const thickness = 0.3;

  const frameMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000,
  });
  const boxXGeometry = new THREE.BoxGeometry(planeX, thickness, thickness);
  const boxYGeometry = new THREE.BoxGeometry(thickness, planeY, thickness);
  const boxZGeometry = new THREE.BoxGeometry(thickness, thickness, planeZ);

  const boxXPosition = [
    { y: planeY / 2, z: -planeZ / 2 },
    { y: planeY / 2, z: planeZ / 2 },
    { y: -planeY / 2, z: -planeZ / 2 },
    { y: -planeY / 2, z: planeZ / 2 },
  ];
  const boxYPosition = [
    { x: -planeX / 2, z: -planeZ / 2 },
    { x: -planeX / 3, z: -planeZ / 2 },
    { x: -planeX / 6, z: -planeZ / 2 },
    { x: -planeX / 2, z: planeZ / 2 },
    { x: -planeX / 3, z: planeZ / 2 },
    { x: -planeX / 6, z: planeZ / 2 },
    { x: 0, z: -planeZ / 2 },
    { x: 0, z: planeZ / 2 },
    { x: planeX / 2, z: -planeZ / 2 },
    { x: planeX / 3, z: -planeZ / 2 },
    { x: planeX / 6, z: -planeZ / 2 },
    { x: planeX / 2, z: planeZ / 2 },
    { x: planeX / 3, z: planeZ / 2 },
    { x: planeX / 6, z: planeZ / 2 },
  ];
  const boxZPosition = [
    { x: -planeX / 2, y: -planeY / 2 },
    { x: -planeX / 3, y: -planeY / 2 },
    { x: -planeX / 6, y: -planeY / 2 },
    { x: -planeX / 2, y: planeY / 2 },
    { x: -planeX / 3, y: planeY / 2 },
    { x: -planeX / 6, y: planeY / 2 },
    { x: 0, y: -planeY / 2 },
    { x: 0, y: planeY / 2 },
    { x: planeX / 2, y: -planeY / 2 },
    { x: planeX / 3, y: -planeY / 2 },
    { x: planeX / 6, y: -planeY / 2 },
    { x: planeX / 2, y: planeY / 2 },
    { x: planeX / 3, y: planeY / 2 },
    { x: planeX / 6, y: planeY / 2 },
  ];

  for (let i = 0; i < 4; i += 1) {
    const box = new THREE.Mesh(boxXGeometry, frameMaterial);
    box.position.set(0, boxXPosition[i].y, boxXPosition[i].z);
    frame.add(box);
  }
  for (let i = 0; i < 14; i += 1) {
    const boxY = new THREE.Mesh(boxYGeometry, frameMaterial);
    const boxZ = new THREE.Mesh(boxZGeometry, frameMaterial);
    boxY.position.set(boxYPosition[i].x, 0, boxYPosition[i].z);
    boxZ.position.set(boxZPosition[i].x, boxZPosition[i].y, 0);
    frame.add(boxY);
    frame.add(boxZ);
  }

  map.add(frame);

  // map plane
  const mapPlaneMaterial = new THREE.MeshBasicMaterial({
    color: 0x1f023c,
    transparent: true,
    opacity: 0.7,
  });
  const mapPlane = [
    {
      name: 'topPlane',
      h: planeZ,
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      position: { x: 0, y: planeY / 2 + thickness / 2, z: 0 },
    },
    {
      name: 'bottomPlane',
      h: planeZ,
      rotation: { x: -Math.PI / 2, y: 0, z: 0 },
      position: { x: 0, y: -planeY / 2 - thickness / 2, z: 0 },
    },
    {
      name: 'rightPlane',
      h: planeY,
      rotation: { x: Math.PI, y: 0, z: 0 },
      position: { x: 0, y: 0, z: planeZ / 2 + thickness / 2 },
    },
    {
      name: 'leftPlane',
      h: planeY,
      rotation: { x: 0, y: 0, z: 0 },
      position: { x: 0, y: 0, z: -planeZ / 2 - thickness / 2 },
    },
  ];

  mapPlane.forEach((plane) => {
    const mapPlaneMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(planeX, plane.h),
      mapPlaneMaterial.clone()
    );
    mapPlaneMesh.position.set(
      plane.position.x,
      plane.position.y,
      plane.position.z
    );
    mapPlaneMesh.rotation.set(
      plane.rotation.x,
      plane.rotation.y,
      plane.rotation.z
    );
    mapPlaneMesh.name = plane.name;
    map.add(mapPlaneMesh);
  });

  map.position.set(0, 0, 0);
  map.name = 'map';
  scene.add(map);

  const box3 = new THREE.Box3().setFromObject(map);
  const boxCenter = new THREE.Vector3();
  box3.getCenter(boxCenter);
}

export default createMap;
