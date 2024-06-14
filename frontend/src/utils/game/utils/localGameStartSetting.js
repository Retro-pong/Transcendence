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
  return newInfo;
}

export default localGameStartSetting;
