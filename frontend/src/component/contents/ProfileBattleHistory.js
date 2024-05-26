const ProfileBattleHistory = ({ nick, history }) => {
  const battles = history
    .map(
      (battle) =>
        `<div class="row">
					<div class="col-4 d-flex justify-content-center">${nick}</div>
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

export default ProfileBattleHistory;
