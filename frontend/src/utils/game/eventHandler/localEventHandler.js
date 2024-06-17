function localEventHandler(canvas, scene) {
  const redPaddle = scene.getObjectByName('redPaddle');
  const bluePaddle = scene.getObjectByName('bluePaddle');

  const keyPressed = {
    w: false,
    s: false,
    a: false,
    d: false,
    up: false,
    down: false,
    left: false,
    right: false,
  };

  function handleKeyDown(e) {
    switch (e.code) {
      case 'KeyW':
        keyPressed.w = true;
        break;
      case 'KeyS':
        keyPressed.s = true;
        break;
      case 'KeyA':
        keyPressed.a = true;
        break;
      case 'KeyD':
        keyPressed.d = true;
        break;
      case 'ArrowUp':
        keyPressed.up = true;
        break;
      case 'ArrowDown':
        keyPressed.down = true;
        break;
      case 'ArrowLeft':
        keyPressed.left = true;
        break;
      case 'ArrowRight':
        keyPressed.right = true;
        break;
      default:
        break;
    }
  }

  function handleKeyUp(e) {
    switch (e.code) {
      case 'KeyW':
        keyPressed.w = false;
        break;
      case 'KeyS':
        keyPressed.s = false;
        break;
      case 'KeyA':
        keyPressed.a = false;
        break;
      case 'KeyD':
        keyPressed.d = false;
        break;
      case 'ArrowUp':
        keyPressed.up = false;
        break;
      case 'ArrowDown':
        keyPressed.down = false;
        break;
      case 'ArrowLeft':
        keyPressed.left = false;
        break;
      case 'ArrowRight':
        keyPressed.right = false;
        break;
      default:
        break;
    }
  }

  function movePaddle() {
    const move = 0.2;
    if (keyPressed.w && redPaddle.position.y < 5) redPaddle.position.y += move;
    if (keyPressed.s && redPaddle.position.y > -5) redPaddle.position.y -= move;
    if (keyPressed.a && redPaddle.position.z < 7.5)
      redPaddle.position.z += move;
    if (keyPressed.d && redPaddle.position.z > -7.5)
      redPaddle.position.z -= move;
    if (keyPressed.up && bluePaddle.position.y < 5)
      bluePaddle.position.y += move;
    if (keyPressed.down && bluePaddle.position.y > -5)
      bluePaddle.position.y -= move;
    if (keyPressed.left && bluePaddle.position.z > -7.5)
      bluePaddle.position.z -= move;
    if (keyPressed.right && bluePaddle.position.z < 7.5)
      bluePaddle.position.z += move;
  }

  canvas.focus();
  canvas.addEventListener('keydown', handleKeyDown, false);
  canvas.addEventListener('keyup', handleKeyUp, false);
  setInterval(movePaddle, 10);

  function removeEventListeners() {
    canvas.removeEventListener('keydown', handleKeyDown, false);
    canvas.removeEventListener('keyup', handleKeyUp, false);
  }

  return removeEventListeners;
}

export default localEventHandler;
