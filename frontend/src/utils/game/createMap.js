import * as THREE from 'three';

function createMap(scene, controls) {
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

  const edgePoints = {
    A: new THREE.Vector3(-planeX / 2, planeY / 2, -planeZ / 2), // 왼쪽면 좌측 상단
    B: new THREE.Vector3(-planeX / 2, planeY / 2, planeZ / 2), // 왼쪽면 우측 상단
    C: new THREE.Vector3(-planeX / 2, -planeY / 2, -planeZ / 2), // 왼쪽면 좌측 하단
    D: new THREE.Vector3(-planeX / 2, -planeY / 2, planeZ / 2), // 왼쪽면 우측 하단
    E: new THREE.Vector3(planeX / 2, planeY / 2, planeZ / 2), // 오른쪽면 좌측 상단
    F: new THREE.Vector3(planeX / 2, planeY / 2, -planeZ / 2), // 오른쪽면 우측 상단
    G: new THREE.Vector3(planeX / 2, -planeY / 2, -planeZ / 2), // 오른쪽면 우측 하단
    H: new THREE.Vector3(planeX / 2, -planeY / 2, planeZ / 2), // 오른쪽면 좌측 하단

    M1_A: new THREE.Vector3(-planeX / 6, planeY / 2, planeZ / 2),
    M1_B: new THREE.Vector3(-planeX / 6, -planeY / 2, planeZ / 2),
    M1_C: new THREE.Vector3(-planeX / 6, planeY / 2, -planeZ / 2),
    M1_D: new THREE.Vector3(-planeX / 6, -planeY / 2, -planeZ / 2),

    M2_A: new THREE.Vector3(-planeX / 3, planeY / 2, planeZ / 2),
    M2_B: new THREE.Vector3(-planeX / 3, -planeY / 2, planeZ / 2),
    M2_C: new THREE.Vector3(-planeX / 3, planeY / 2, -planeZ / 2),
    M2_D: new THREE.Vector3(-planeX / 3, -planeY / 2, -planeZ / 2),

    M3_A: new THREE.Vector3(0, planeY / 2, planeZ / 2),
    M3_B: new THREE.Vector3(0, -planeY / 2, planeZ / 2),
    M3_C: new THREE.Vector3(0, planeY / 2, -planeZ / 2),
    M3_D: new THREE.Vector3(0, -planeY / 2, -planeZ / 2),

    M4_A: new THREE.Vector3(planeX / 6, planeY / 2, planeZ / 2),
    M4_B: new THREE.Vector3(planeX / 6, -planeY / 2, planeZ / 2),
    M4_C: new THREE.Vector3(planeX / 6, planeY / 2, -planeZ / 2),
    M4_D: new THREE.Vector3(planeX / 6, -planeY / 2, -planeZ / 2),

    M5_A: new THREE.Vector3(planeX / 3, planeY / 2, planeZ / 2),
    M5_B: new THREE.Vector3(planeX / 3, -planeY / 2, planeZ / 2),
    M5_C: new THREE.Vector3(planeX / 3, planeY / 2, -planeZ / 2),
    M5_D: new THREE.Vector3(planeX / 3, -planeY / 2, -planeZ / 2),
  };

  // Create the edges of the plane
  const edgesGeometry = new THREE.BufferGeometry().setFromPoints([
    // 상
    edgePoints.A,
    edgePoints.B,
    edgePoints.B,
    edgePoints.E,
    edgePoints.E,
    edgePoints.F,
    edgePoints.F,
    edgePoints.A,
    // 하
    edgePoints.C,
    edgePoints.D,
    edgePoints.D,
    edgePoints.H,
    edgePoints.H,
    edgePoints.G,
    edgePoints.G,
    edgePoints.C,

    // 앞
    edgePoints.B,
    edgePoints.D,
    edgePoints.D,
    edgePoints.H,
    edgePoints.H,
    edgePoints.E,
    edgePoints.E,
    edgePoints.B,

    // 뒤
    edgePoints.A,
    edgePoints.C,
    edgePoints.C,
    edgePoints.G,
    edgePoints.G,
    edgePoints.F,
    edgePoints.F,
    edgePoints.A,

    edgePoints.M1_A,
    edgePoints.M1_B,
    edgePoints.M1_B,
    edgePoints.M1_D,
    edgePoints.M1_D,
    edgePoints.M1_C,
    edgePoints.M1_C,
    edgePoints.M1_A,

    edgePoints.M2_A,
    edgePoints.M2_B,
    edgePoints.M2_B,
    edgePoints.M2_D,
    edgePoints.M2_D,
    edgePoints.M2_C,
    edgePoints.M2_C,
    edgePoints.M2_A,

    edgePoints.M3_A,
    edgePoints.M3_B,
    edgePoints.M3_B,
    edgePoints.M3_D,
    edgePoints.M3_D,
    edgePoints.M3_C,
    edgePoints.M3_C,
    edgePoints.M3_A,

    edgePoints.M4_A,
    edgePoints.M4_B,
    edgePoints.M4_B,
    edgePoints.M4_D,
    edgePoints.M4_D,
    edgePoints.M4_C,
    edgePoints.M4_C,
    edgePoints.M4_A,

    edgePoints.M5_A,
    edgePoints.M5_B,
    edgePoints.M5_B,
    edgePoints.M5_D,
    edgePoints.M5_D,
    edgePoints.M5_C,
    edgePoints.M5_C,
    edgePoints.M5_A,
  ]);

  const edgesMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });
  const box = new THREE.LineSegments(edgesGeometry, edgesMaterial);

  map.add(box);

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
