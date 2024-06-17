const GameManual = () => {
  const coloredText = (text) => `<span class="text-info">${text}</span>`;
  return `
    <div class="container-fluid">
      <div class="d-flex flex-column justify-content-center px-3">
        <h1 class="fs-11 text-success">Remote Play</h1>
        <p class="fs-8 text-break">
         ${coloredText('mouse')} control
        </p>
        <h1 class="fs-11 text-success">Local Play</h1>
        <p class="fs-8 text-break">
          Player 1 key
          <br />
          ${coloredText('[ W / S / A / D ]')}
          <br />
          Player 2 key
          <br />
          ${coloredText('[ Up / Down / Left / Right ]')}
        </p>
      </div>
    </div>
  `;
};

export default GameManual;
