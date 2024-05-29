import gameUtils from '@/utils/game/gameUtils';

function eventHandler(canvas, scene, camera, controls) {
  const map = scene.getObjectByName('map');
  const redPaddle = scene.getObjectByName('redPaddle');
  const bluePaddle = scene.getObjectByName('bluePaddle');

  canvas.focus();
  const keyPressed = {
    w: false,
    s: false,
    a: false,
    d: false,
  };

  // 키보드 컨트롤
  canvas.addEventListener('keydown', (e) => {
    // 시점
    if (e.code === 'Digit1') {
      camera.position.set(-33, 0, 0);
      controls.update();
    }
    if (e.code === 'Digit2') {
      camera.position.set(33, 0, 0);
      controls.update();
    }

    // 방향키
    if (e.code === 'KeyW') {
      keyPressed.w = true;
    }
    if (e.code === 'KeyS') {
      keyPressed.s = true;
    }
    if (e.code === 'KeyA') {
      keyPressed.a = true;
    }
    if (e.code === 'KeyD') {
      keyPressed.d = true;
    }
  });

  canvas.addEventListener('keyup', (e) => {
    if (e.code === 'KeyW') keyPressed.w = false;
    if (e.code === 'KeyS') keyPressed.s = false;
    if (e.code === 'KeyA') keyPressed.a = false;
    if (e.code === 'KeyD') keyPressed.d = false;
  });

  const movePaddle = () => {
    const move = 0.2;
    if (keyPressed.w) {
      if (redPaddle.position.y < 5) redPaddle.position.y += move;
    }
    if (keyPressed.s) {
      if (redPaddle.position.y > -5) redPaddle.position.y -= move;
    }
    if (keyPressed.a) {
      if (redPaddle.position.z < 7.5) redPaddle.position.z += move;
    }
    if (keyPressed.d) {
      if (redPaddle.position.z > -7.5) redPaddle.position.z -= move;
    }
  };

  setInterval(movePaddle, 10);

  // 마우스 컨트롤
  canvas.addEventListener('mousemove', (e) => {
    const x = e.clientX;
    const y = e.clientY;

    const mousePosition = gameUtils.getMouseWorldPositionInObject(
      x,
      y,
      camera,
      map
    );

    if (!mousePosition) return;
    bluePaddle.position.y = mousePosition.y;
    bluePaddle.position.z = mousePosition.z;
  });
}

export default eventHandler;
