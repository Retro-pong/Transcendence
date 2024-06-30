const BattleHistory = (username = '', history = []) => {
  if (history.length === 0) {
    return `
      <div class="d-flex justify-content-center align-items-center h-100">
        <div class="p-5"> No Battle History :( </div>
      </div>
    `;
  }
  const historyData = history
    .map((data) => {
      const player1 = data.player1_username;
      const player2 = data.player2_username;
      const player1Color =
        username === player1 ? 'text-success' : 'text-success-emphasis';
      const player2Color =
        username === player2 ? 'text-success' : 'text-success-emphasis';
      const score1 = data.player1_score;
      const score2 = data.player2_score;
      const date = new Date(data.start_time);
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const hour = date.getHours().toString().padStart(2, '0');
      const min = date.getMinutes().toString().padStart(2, '0');

      return `
      <tr>
        <td>${month}/${day}<br/>${hour}:${min}</td>
        <td><span class="${player1Color}">${player1}</span><br/>${score1}</td>
        <td>:<br/><span class="text-light-emphasis fs-2">:</span></td>
        <td><span class="${player2Color}">${player2}</span><br/>${score2}</td>
      </tr>
    `;
    })
    .join('');

  return `
    <table class="table table-borderless text-center">
      <thead>
        <tr>
          <th scope="col" class="text-warning fs-2">DATE</th>
          <th scope="col" class="text-warning fs-2">PLAYER1</th>
          <th scope="col" class="text-warning fs-2"></th>
          <th scope="col" class="text-warning fs-2">PLAYER2</th>
        </tr>
      </thead>
      <tbody>
        ${historyData}
      </tbody>
    </table>
  `;
};

export default BattleHistory;
