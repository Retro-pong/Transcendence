function eventHandler(canvas, scene, camera, renderer, controls) {
  const ball = scene.getObjectByName('ball');
  const redPaddle = scene.getObjectByName('redPaddle');
  const bluePaddle = scene.getObjectByName('bluePaddle');

  // 키보드 컨트롤
  canvas.addEventListener('keydown', (e) => {
    console.log(e.key);

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
  });

  // 마우스 컨트롤
  canvas.addEventListener('mousemove', (e) => {});
}

export default eventHandler;
