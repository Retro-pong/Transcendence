import gameUtils from '@/utils/game/gameUtils';

function eventHandler(canvas, scene, camera, renderer, controls) {
  const map = scene.getObjectByName('map');
  const ball = scene.getObjectByName('ball');
  const redPaddle = scene.getObjectByName('redPaddle');
  const bluePaddle = scene.getObjectByName('bluePaddle');

  canvas.focus();
  // 키보드 컨트롤
  canvas.addEventListener('keydown', (e) => {
    // 시점
    if (e.key === '1') {
      camera.position.set(-40, 0, 0);
      controls.update();
    }
    if (e.key === '2') {
      camera.position.set(40, 0, 0);
      controls.update();
    }

    // 방향키
    const move = 1;
    if (e.key === 'w') {
      if (redPaddle.position.y < 5) redPaddle.position.y += move;
    }
    if (e.key === 's') {
      if (redPaddle.position.y > -5) redPaddle.position.y -= move;
    }
    if (e.key === 'a') {
      if (redPaddle.position.z < 7.5) redPaddle.position.z += move;
    }
    if (e.key === 'd') {
      if (redPaddle.position.z > -7.5) redPaddle.position.z -= move;
    }
  });

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
