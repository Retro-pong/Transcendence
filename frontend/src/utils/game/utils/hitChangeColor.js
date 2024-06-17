function hitChangeColor(hitStatus, scene) {
  if (scene === null) return hitStatus;
  const redPaddleBox = scene.getObjectByName('redPaddleBox');
  const bluePaddleBox = scene.getObjectByName('bluePaddleBox');
  const topPlane = scene.getObjectByName('topPlane');
  const bottomPlane = scene.getObjectByName('bottomPlane');
  const rightPlane = scene.getObjectByName('rightPlane');
  const leftPlane = scene.getObjectByName('leftPlane');
  const newStatus = { ...hitStatus };

  // 패들 충돌
  if (newStatus.redPaddleHit === 1) {
    for (let i = 0; i < redPaddleBox.children.length; i += 1) {
      redPaddleBox.children[i].material.color.set(0x00ffff);
    }
    newStatus.redPaddleHit = 2;
  } else if (newStatus.redPaddleHit >= 2 && newStatus.redPaddleHit < 10) {
    newStatus.redPaddleHit += 1;
  } else if (newStatus.redPaddleHit === 10) {
    for (let i = 0; i < redPaddleBox.children.length; i += 1) {
      redPaddleBox.children[i].material.color.set(0xff0000);
    }
    newStatus.redPaddleHit = 0;
  }
  if (newStatus.bluePaddleHit === 1) {
    for (let i = 0; i < bluePaddleBox.children.length; i += 1) {
      bluePaddleBox.children[i].material.color.set(0x00ffff);
    }
    newStatus.bluePaddleHit = 2;
  } else if (newStatus.bluePaddleHit >= 2 && newStatus.bluePaddleHit < 10) {
    newStatus.bluePaddleHit += 1;
  } else if (newStatus.bluePaddleHit === 10) {
    for (let i = 0; i < bluePaddleBox.children.length; i += 1) {
      bluePaddleBox.children[i].material.color.set(0x0000ff);
    }
    newStatus.bluePaddleHit = 0;
  }

  // 벽 충돌
  if (newStatus.topWallHit === 1) {
    topPlane.material.color.set(0x7986cb);
    newStatus.topWallHit = 2;
  } else if (newStatus.topWallHit >= 2 && newStatus.topWallHit < 10) {
    newStatus.topWallHit += 1;
  } else if (newStatus.topWallHit === 10) {
    topPlane.material.color.set(0x1f023c);
    newStatus.topWallHit = 0;
  }
  if (newStatus.bottomWallHit === 1) {
    bottomPlane.material.color.set(0x7986cb);
    newStatus.bottomWallHit = 2;
  } else if (newStatus.bottomWallHit >= 2 && newStatus.bottomWallHit < 10) {
    newStatus.bottomWallHit += 1;
  } else if (newStatus.bottomWallHit === 10) {
    bottomPlane.material.color.set(0x1f023c);
    newStatus.bottomWallHit = 0;
  }
  if (newStatus.rightWallHit === 1) {
    rightPlane.material.color.set(0x7986cb);
    newStatus.rightWallHit = 2;
  } else if (newStatus.rightWallHit >= 2 && newStatus.rightWallHit < 10) {
    newStatus.rightWallHit += 1;
  } else if (newStatus.rightWallHit === 10) {
    rightPlane.material.color.set(0x1f023c);
    newStatus.rightWallHit = 0;
  }
  if (newStatus.leftWallHit === 1) {
    leftPlane.material.color.set(0x7986cb);
    newStatus.leftWallHit = 2;
  } else if (newStatus.leftWallHit >= 2 && newStatus.leftWallHit < 10) {
    newStatus.leftWallHit += 1;
  } else if (newStatus.leftWallHit === 10) {
    leftPlane.material.color.set(0x1f023c);
    newStatus.leftWallHit = 0;
  }

  return newStatus;
}

export default hitChangeColor;
