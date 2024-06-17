function checkPaddleHit(type, scene) {
  if (scene === null) return 0;
  const ball = scene.getObjectByName('ball');
  const redPaddle = scene.getObjectByName('redPaddle');
  const bluePaddle = scene.getObjectByName('bluePaddle');
  let py;
  let pz;

  if (type === 'red') {
    py = redPaddle.position.y;
    pz = redPaddle.position.z;
  } else {
    py = bluePaddle.position.y;
    pz = bluePaddle.position.z;
  }
  const by = ball.position.y;
  const bz = ball.position.z;
  // 범위 안에 들어왔는지 체크
  if (
    ((by - 1 > py - 1.5 && by - 1 < py + 1.5) ||
      (by + 1 > py - 1.5 && by + 1 < py + 1.5)) &&
    ((bz - 1 > pz - 1.5 && bz - 1 < pz + 1.5) ||
      (bz + 1 > pz - 1.5 && bz + 1 < pz + 1.5))
  ) {
    return 1;
  }
  return 0;
}

export default checkPaddleHit;
