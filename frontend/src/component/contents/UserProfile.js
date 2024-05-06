import UserProfileInfo from '@component/contents/UserProfileInfo';
import userProfileBattleHistory from '@component/contents/UserProfileBattleHistory';

const UserProfile = () => {
  const user = {
    nickname: 'test',
    email: 'hyungjpa@naver.com',
    winLose: '10 / 5',
    comment: 'hi',
  };

  const battle = [
    {
      myTeam: 'hyungjpa',
      enemyTeam: 'hyobicho',
      score: '1 : 2',
    },
    {
      myTeam: 'hyungjpa',
      enemyTeam: 'wonjilee',
      score: '1 : 3',
    },
    {
      myTeam: 'hyungjpa',
      enemyTeam: 'subinlee',
      score: '1 : 4',
    },
  ];
  return `
    <div class="container-fluid">
      <div class="row d-flex flex-row my-5">
      	<div class="col-8">
      	${UserProfileInfo(user)}
				</div>
      	<div class="col-4">
      		<img src="https://www.blueconomy.co.kr/news/photo/202402/2399_3001_921.png" width="300" height="200" alt="hi"/>
      	</div>
      </div>
      <div class="row my-5">
      	<h1>BATTLE HISTORY</h1>
      	${userProfileBattleHistory(battle)}
      </div>
    </div>
  `;
};

export default UserProfile;
