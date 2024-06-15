function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  renderer.setPixelRatio(window.devicePixelRatio);
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}

export default resizeRendererToDisplaySize;
