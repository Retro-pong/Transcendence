import UserProfileInfo from '@component/contents/UserProfileInfo';
import userProfileBattleHistory from '@component/contents/UserProfileBattleHistory';

const UserProfile = ({ nickname, email, winLose, comment, img, battle }) => {

  return `
    <div class="row d-flex flex-row mt-4">
      <div class="col-9 px-4 fs-7">
      ${UserProfileInfo({ nickname, email, winLose, comment })}
      </div>
      <div class="col-3 p-2">
        <img src=${img} width="100%" height="90%" alt="user profile"/>
      </div>
    </div>
    <div class="row my-4">
      <div class="d-flex justify-content-center fs-8">BATTLE HISTORY</div>
      ${userProfileBattleHistory({ user: nickname, history: battle })}
    </div>
  `;
};

export default UserProfile;
