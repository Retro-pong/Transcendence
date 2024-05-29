import * as THREE from "three";

function cameraSetting(type) {
	const fov = type === 'local' ? 60 : 45;
	const aspect = 2; // the canvas default
	const near = 0.1;
	const far = 1000;
	const camera = {
		multi: null,
		red: null,
		blue: null,
	};

	if (type === 'local') {
		const blueCamera = new THREE.PerspectiveCamera(fov, aspect, near, far);
		const redCamera = new THREE.PerspectiveCamera(fov, aspect, near, far);
		blueCamera.position.set(-33, 0, 0);
		redCamera.position.set(33, 0, 0);
		blueCamera.lookAt(0, 0, 0);
		redCamera.lookAt(0, 0, 0);
		camera.blue = blueCamera;
		camera.red = redCamera;
	}
	// TODO: multi 일 때 어느쪽 패들인지 인자 받아서 세팅 필요
	if (type === 'multi') {
		const multiCamera = new THREE.PerspectiveCamera(fov, aspect, near, far);
		multiCamera.position.set(-33, 0, 0);
		multiCamera.lookAt(0, 0, 0);
		camera.multi = multiCamera;
	}
	return camera;
}

export default cameraSetting;
