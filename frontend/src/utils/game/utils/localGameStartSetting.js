function localGameStartSetting(localGameInfo, ball) {
  const newInfo = { ...localGameInfo };
  newInfo.a = newInfo.start === 'blue' ? 0.2 : -0.2;
  newInfo.b = 0.1;
  newInfo.c = 0.1;
  ball.position.set(
    newInfo.start === 'blue' ? -18 : 18,
    Math.random() * 8 - 4,
    Math.random() * 12 - 6
  );
  newInfo.start = 'off';
  newInfo.hitStatus = {
    redPaddleHit: 10,
    bluePaddleHit: 10,
    topWallHit: 10,
    bottomWallHit: 10,
    rightWallHit: 10,
    leftWallHit: 10,
  };
  return newInfo;
}

export default localGameStartSetting;
