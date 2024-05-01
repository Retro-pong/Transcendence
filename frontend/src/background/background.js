/**
 * Draw the background of the game
 * top, left, right, bottom
 */
const drawBackground = () => {
  const background = document.getElementById('background');

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
