import * as THREE from 'three';

function cameraSetting(mode, side) {
  const fov = mode === 'local' ? 65 : 45;
  const aspect = 2; // the canvas default
  const near = 0.1;
  const far = 1000;
  const camera = {
    multi: null,
    red: null,
    blue: null,
  };

  if (mode === 'local') {
    const blueCamera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    const redCamera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    blueCamera.position.set(-33, 0, 0);
    redCamera.position.set(33, 0, 0);
    blueCamera.lookAt(0, 0, 0);
    redCamera.lookAt(0, 0, 0);
    camera.blue = blueCamera;
    camera.red = redCamera;
  }
  if (mode === 'multi') {
    const multiCamera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    multiCamera.position.set(side === 'red' ? 33 : -33, 0, 0);
    multiCamera.lookAt(0, 0, 0);
    camera.multi = multiCamera;
  }
  return camera;
}

export default cameraSetting;
