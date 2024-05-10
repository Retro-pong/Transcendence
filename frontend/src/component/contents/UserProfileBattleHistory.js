const userProfileBattleHistory = ({ user, history }) => {
  const battles = history
    .map(
      (battle) =>
        `<div class="row">
					<div class="col-4 d-flex justify-content-center">${user}</div>
					<div class="col-4 d-flex justify-content-center">${battle.score}</div>
					<div class="col-4 d-flex justify-content-center">${battle.opponent}</div>
				</div>`
    )
    .join('');

  return `
  	<div class="battle-history">
			${battles}
		</div>
	`;
};

export default userProfileBattleHistory;
