function rendering(renderer, scene, camera, type) {
  if (type === 'multi') {
    renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
    renderer.setScissor(0, 0, window.innerWidth, window.innerHeight);
    renderer.setScissorTest(true);
    if (camera.multi) renderer.render(scene, camera.multi);
  }
  if (type === 'local') {
    //   첫번째 뷰 렌더링
    renderer.setViewport(0, 0, window.innerWidth / 2, window.innerHeight);
    renderer.setScissor(0, 0, window.innerWidth / 2, window.innerHeight);
    renderer.setScissorTest(true);
    if (camera.red) renderer.render(scene, camera.red);

    // 두 번째 뷰 렌더링
    renderer.setViewport(
      window.innerWidth / 2,
      0,
      window.innerWidth / 2,
      window.innerHeight
    );
    renderer.setScissor(
      window.innerWidth / 2,
      0,
      window.innerWidth / 2,
      window.innerHeight
    );
    renderer.setScissorTest(true);
    if (camera.blue) renderer.render(scene, camera.blue);
  }
}

export default rendering;
