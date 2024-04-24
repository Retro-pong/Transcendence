/**
 * Draw the background of the game
 * top, left, right, bottom
 */
const drawBackground = () => {
  const background = document.getElementById('background');

  // v1
  // const top = document.createElement('div');
  // top.className = 'top';
  // background.appendChild(top);

  // const left = document.createElement('div');
  // left.className = 'left';
  // background.appendChild(left);

  // const right = document.createElement('div');
  // right.className = 'right';
  // background.appendChild(right);

  // const bottom = document.createElement('div');
  // bottom.className = 'bottom';
  // background.appendChild(bottom);

  // for (let i = 1; i < 6; i += 1) {
  //   const topDiv = document.createElement('div');
  //   const leftDiv = document.createElement('div');
  //   const rightDiv = document.createElement('div');
  //   const bottomDiv = document.createElement('div');

  //   topDiv.className = `top-element-${i}`;
  //   leftDiv.className = `left-element-${i}`;
  //   rightDiv.className = `right-element-${i}`;
  //   bottomDiv.className = `bottom-element-${i}`;

  //   top.appendChild(topDiv);
  //   left.appendChild(leftDiv);
  //   right.appendChild(rightDiv);
  //   bottom.appendChild(bottomDiv);

  // v2
  const left = document.createElement('div');
  left.className = 'left';
  background.appendChild(left);

  const right = document.createElement('div');
  right.className = 'right';
  background.appendChild(right);

  for (let i = 1; i < 10; i += 1) {
    const leftDiv = document.createElement('div');
    const rightDiv = document.createElement('div');

    leftDiv.className = `left-element-${i}`;
    rightDiv.className = `right-element-${i}`;

    left.appendChild(leftDiv);
    right.appendChild(rightDiv);
  }
};

export default drawBackground;
