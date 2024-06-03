import gameUtils from '@/utils/game/gameUtils';

function eventHandler(canvas, scene, camera, mode, side) {
  const map = scene.getObjectByName('map');
  const redPaddle = scene.getObjectByName('redPaddle');
  const bluePaddle = scene.getObjectByName('bluePaddle');
  let controler = 'keyboard';

  canvas.focus();
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

  // TODO: 멀티 플레이 시 키보드 컨트롤 방향키만 사용하도록 수정, 패들도 하나 받기
  // 키보드 컨트롤
  // wasd -> 로컬에서만 사용
  canvas.addEventListener('keydown', (e) => {
    // 방향키
    if (mode === 'local') {
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
    }
    if (controler === 'keyboard') {
      if (e.code === 'ArrowUp') {
        keyPressed.up = true;
      }
      if (e.code === 'ArrowDown') {
        keyPressed.down = true;
      }
      if (e.code === 'ArrowLeft') {
        keyPressed.left = true;
      }
      if (e.code === 'ArrowRight') {
        keyPressed.right = true;
      }
    }

    // 컨트롤러 스위치
    console.log(e.code);
    if (mode === 'multi' && e.code === 'Digit1') {
      controler = 'keyboard';
    }
    if (mode === 'multi' && e.code === 'Digit2') {
      controler = 'mouse';
    }
  });

  canvas.addEventListener('keyup', (e) => {
    if (e.code === 'KeyW') keyPressed.w = false;
    if (e.code === 'KeyS') keyPressed.s = false;
    if (e.code === 'KeyA') keyPressed.a = false;
    if (e.code === 'KeyD') keyPressed.d = false;
    if (e.code === 'ArrowUp') keyPressed.up = false;
    if (e.code === 'ArrowDown') keyPressed.down = false;
    if (e.code === 'ArrowLeft') keyPressed.left = false;
    if (e.code === 'ArrowRight') keyPressed.right = false;
  });

  let paddle;
  if (mode === 'local') {
    paddle = bluePaddle;
  } else {
    paddle = side === 'red' ? redPaddle : bluePaddle;
  }
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
    // multi, local 구분
    if (keyPressed.up) {
      if (paddle === bluePaddle && bluePaddle.position.y < 5)
        bluePaddle.position.y += move;
      if (paddle === redPaddle && redPaddle.position.y < 5)
        redPaddle.position.y += move;
    }
    if (keyPressed.down) {
      if (paddle === bluePaddle && bluePaddle.position.y > -5)
        bluePaddle.position.y -= move;
      if (paddle === redPaddle && redPaddle.position.y > -5)
        redPaddle.position.y -= move;
    }
    if (keyPressed.left) {
      if (paddle === bluePaddle && bluePaddle.position.z > -7.5)
        bluePaddle.position.z -= move;
      if (paddle === redPaddle && redPaddle.position.z < 7.5)
        redPaddle.position.z += move;
    }
    if (keyPressed.right) {
      if (paddle === bluePaddle && bluePaddle.position.z < 7.5)
        bluePaddle.position.z += move;
      if (paddle === redPaddle && redPaddle.position.z > -7.5)
        redPaddle.position.z -= move;
    }
  };

  setInterval(movePaddle, 10);

  // 마우스 컨트롤
  canvas.addEventListener('mousemove', (e) => {
    if (controler === 'keyboard') return;
    const x = e.clientX;
    const y = e.clientY;

    const mousePosition = gameUtils.getMouseWorldPositionInObject(
      x,
      y,
      camera.multi,
      map
    );
    if (!mousePosition) return;
    bluePaddle.position.y = mousePosition.y;
    bluePaddle.position.z = mousePosition.z;
  });
}

export default eventHandler;
