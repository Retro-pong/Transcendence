import UserProfileInfo from '@component/contents/UserProfileInfo';
import userProfileBattleHistory from '@component/contents/UserProfileBattleHistory';
import openModalButton from '@component/button/OpenModalButton';
import modalComponent from '@component/modal/ModalComponent';
import editProfile from '@component/contents/EditProfile';

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
      	<div class="col-4 bg-dark">
      		<img src="" alt="hi"/>
      	</div>
      </div>
      <div class="row my-5">
      	<h1>BATTLE HISTORY</h1>
      	${userProfileBattleHistory(battle)}
      </div>
      <div class="row d-flex justify-content-center">
      	${openModalButton({ text: 'EDIT PROFILE', classList: 'btn btn-no-outline-hover fs-8', modalId: '#editProfile' })}
      	${modalComponent({ borderColor: 'pink', title: 'EDIT PROFILE', modalId: 'editProfile', content: editProfile({ nickname: 'hyungjpa', comment: 'hihihihi' }), buttonList: ['confirmBtn'] })}
      </div>
    </div>
  `;
};

export default UserProfile;
