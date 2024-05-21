import UserProfileInfo from '@component/contents/UserProfileInfo';
import userProfileBattleHistory from '@component/contents/UserProfileBattleHistory';

const UserProfile = ({ nick, email, winLose, comment, img, battle }) => {
  return `
    <div class="row d-flex flex-row mt-4">
      <div class="col-9 px-4 fs-7">
      ${UserProfileInfo({ nick, email, winLose, comment })}
      </div>
      <div class="col-3 p-2 h-90 border-5 border-success rounded">
        <label for="profileImg" class="h-100">
          <img id="profileImgSrc" src=${img} width="100%" height="90%" alt="user profile"/>
        </label>
        <input type="file" accept="image/jpg, image/png" id="profileImg" class="d-none border-0">
      </div>
    </div>
    <div class="row my-4">
      <div class="d-flex justify-content-center fs-8">BATTLE HISTORY</div>
      ${userProfileBattleHistory({ user: nick, history: battle })}
    </div>
  `;
};

export default UserProfile;
