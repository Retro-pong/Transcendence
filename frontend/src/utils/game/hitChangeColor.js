function hitChangeColor(hitStatus, scene) {
	const redPaddleBox = scene.getObjectByName('redPaddleBox');
	const bluePaddleBox = scene.getObjectByName('bluePaddleBox');
	const topPlane = scene.getObjectByName('topPlane');
	const bottomPlane = scene.getObjectByName('bottomPlane');
	const rightPlane = scene.getObjectByName('rightPlane');
	const leftPlane = scene.getObjectByName('leftPlane');


	// 패들 충돌
	if (hitStatus.redPaddleHit === 1) {
		for (let i = 0; i < redPaddleBox.children.length; i += 1) {
			redPaddleBox.children[i].material.color.set(0x00ffff);
		}
		hitStatus.redPaddleHit = 2;
	} else if (hitStatus.redPaddleHit >= 2 && hitStatus.redPaddleHit < 10) {
		hitStatus.redPaddleHit += 1;
	} else if (hitStatus.redPaddleHit === 10) {
		for (let i = 0; i < redPaddleBox.children.length; i += 1) {
			redPaddleBox.children[i].material.color.set(0xff0000);
		}
		hitStatus.redPaddleHit = 0;
	}
	if (hitStatus.bluePaddleHit === 1) {
		for (let i = 0; i < bluePaddleBox.children.length; i += 1) {
			bluePaddleBox.children[i].material.color.set(0x00ffff);
		}
		hitStatus.bluePaddleHit = 2;
	} else if (hitStatus.bluePaddleHit >= 2 && hitStatus.bluePaddleHit < 10) {
		hitStatus.bluePaddleHit += 1;
	} else if (hitStatus.bluePaddleHit === 10) {
		for (let i = 0; i < bluePaddleBox.children.length; i += 1) {
			bluePaddleBox.children[i].material.color.set(0x0000ff);
		}
		hitStatus.bluePaddleHit = 0;
	}

	// 벽 충돌
	if (hitStatus.topWallHit === 1) {
		topPlane.material.color.set(0x7986cb);
		hitStatus.topWallHit = 2;
	} else if (hitStatus.topWallHit >= 2 && hitStatus.topWallHit < 10) {
		hitStatus.topWallHit += 1;
	} else if (hitStatus.topWallHit === 10) {
		topPlane.material.color.set(0x1f023c);
		hitStatus.topWallHit = 0;
	}
	if (hitStatus.bottomWallHit === 1) {
		bottomPlane.material.color.set(0x7986cb);
		hitStatus.bottomWallHit = 2;
	} else if (hitStatus.bottomWallHit >= 2 && hitStatus.bottomWallHit < 10) {
		hitStatus.bottomWallHit += 1;
	} else if (hitStatus.bottomWallHit === 10) {
		bottomPlane.material.color.set(0x1f023c);
		hitStatus.bottomWallHit = 0;
	}
	if (hitStatus.rightWallHit === 1) {
		rightPlane.material.color.set(0x7986cb);
		hitStatus.rightWallHit = 2;
	} else if (hitStatus.rightWallHit >= 2 && hitStatus.rightWallHit < 10) {
		hitStatus.rightWallHit += 1;
	} else if (hitStatus.rightWallHit === 10) {
		rightPlane.material.color.set(0x1f023c);
		hitStatus.rightWallHit = 0;
	}
	if (hitStatus.leftWallHit === 1) {
		leftPlane.material.color.set(0x7986cb);
		hitStatus.leftWallHit = 2;
	} else if (hitStatus.leftWallHit >= 2 && hitStatus.leftWallHit < 10) {
		hitStatus.leftWallHit += 1;
	} else if (hitStatus.leftWallHit === 10) {
		leftPlane.material.color.set(0x1f023c);
		hitStatus.leftWallHit = 0;
	}
}

export default hitChangeColor;