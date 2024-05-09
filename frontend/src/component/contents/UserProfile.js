import UserProfileInfo from '@component/contents/UserProfileInfo';
import userProfileBattleHistory from '@component/contents/UserProfileBattleHistory';

const UserProfile = ({ nickname, email, winLose, comment, img, battle }) => {

  return `
    <div class="row d-flex flex-row my-5">
      <div class="col-9 bg-dark px-4 fs-7">
      ${UserProfileInfo({ nickname, email, winLose, comment })}
      </div>
      <div class="col-3 px-4 bg-danger">
        <img src=${img} width="300" height="200" alt="hi"/>
      </div>
    </div>
    <div class="row my-5">
      <div class="d-flex justify-content-center fs-8">BATTLE HISTORY</div>
      ${userProfileBattleHistory({ user: nickname, history: battle })}
    </div>
  `;
};

export default UserProfile;
