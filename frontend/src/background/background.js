const drawBackground = () => {
  const background = document.getElementById('background');

  const left = ['1', '6', '6-5', '12', '3', '9', '10', '1', '8', '11'];
  const right = ['98', '93', '93-5', '87', '96', '90', '89', '98', '91', '88'];
  const leftTop = ['10', '5', '65', '76', '35', '60', '1', '75', '20', '50'];
  const leftTop2 = ['30', '25', '85', '76', '35', '60', '20', '75', '40', '50'];
  const rightTop = ['50', '20', '75', '1', '60', '35', '76', '65', '5', '10'];
  const rightTop2 = [
    '50',
    '40',
    '75',
    '20',
    '60',
    '35',
    '76',
    '85',
    '25',
    '30',
  ];
  const size = [
    'w h-xxxs',
    'w h-xs',
    'w h-xs',
    'w h-xs',
    'w h-xxxs',
    'w h-xxxs',
    'w h-xs',
    'w h-m',
    'w h-xxxs',
    'w h-xxxs',
  ];

  const color = [
    'c-mint',
    'c-mint',
    'c-mint',
    'c-mint',
    'c-pink',
    'c-pink',
    'c-pink',
    'c-white',
    'c-white',
    'c-white',
  ];

  for (let i = 0; i < 10; i += 1) {
    const lFirst = document.createElement('div');
    const lSecond = document.createElement('div');
    const lThird = document.createElement('div');
    const lFirstChild = document.createElement('div');
    const lSecondChild = document.createElement('div');
    const lThirdChild = document.createElement('div');

    lFirst.className = `ele l${left[i]} t${leftTop[i]} ${size[i]} ${color[i]}`;
    lSecond.className = `ele l${left[i]} t${leftTop2[i]} ${size[i]} ${color[i]} d1`;
    lThird.className = `ele l${left[i]} t${leftTop2[i]} ${size[i]} ${color[i]} d2`;

    lFirst.appendChild(lFirstChild);
    lSecond.appendChild(lSecondChild);
    lThird.appendChild(lThirdChild);

    background.appendChild(lFirst);
    background.appendChild(lSecond);
    background.appendChild(lThird);

    const rFirst = document.createElement('div');
    const rSecond = document.createElement('div');
    const rThird = document.createElement('div');
    const rFirstChild = document.createElement('div');
    const rSecondChild = document.createElement('div');
    const rThirdChild = document.createElement('div');

    rFirst.className = `ele l${right[i]} t${rightTop[i]} ${size[i]} ${color[i]}`;
    rSecond.className = `ele l${right[i]} t${rightTop2[i]} ${size[i]} ${color[i]} d1`;
    rThird.className = `ele l${right[i]} t${rightTop2[i]} ${size[i]} ${color[i]} d2`;

    rFirst.appendChild(rFirstChild);
    rSecond.appendChild(rSecondChild);
    rThird.appendChild(rThirdChild);

    background.appendChild(rFirst);
    background.appendChild(rSecond);
    background.appendChild(rThird);
  }
};

export default drawBackground;
