import PageComponent from '@component/PageComponent.js';
import UserProfile from '@component/contents/UserProfile.js';
import Header from '@component/text/Header';
import ProfilePageButtons from '@component/button/ProfilePageButtons';
import ErrorHandler from '@/utils/ErrorHandler';
import Fetch from '@/utils/Fetch';

class Profile extends PageComponent {
  constructor() {
    super();
    this.setTitle('Profile');
  }

  async getUserInfo() {
    return fetch('http://localhost:8080/userInfo').then((res) =>
      res
        .json()
        .catch((err) =>
          ErrorHandler.setToast(err.message || 'Failed to get user info')
        )
    );
  }

  async render() {
    const userInfo = await this.getUserInfo();

    return `
      ${Header({ title: 'PLAYER PROFILE' })}
      <div class="container h-100" style="width: 80%">
        <div class="row d-flex justify-content-center">
          ${UserProfile({
            nick: userInfo.nickname,
            email: userInfo.email,
            winLose: userInfo.winLose,
            comment: userInfo.comment,
            img: userInfo.img,
            battle: userInfo.battleHistory,
          })}
        </div>
        <div class="row d-flex justify-content-center">
          ${ProfilePageButtons({ nick: userInfo.nickname, comment: userInfo.comment })}
        </div>
      </div>
    `;
  }

  updateProfile() {
    document
      .getElementById('editProfileForm')
      .addEventListener('submit', async (e) => {
        e.preventDefault();
        const nick = document.getElementById('editNickname').value;
        const comment = document.getElementById('editComment').value;
        await Fetch.patch(
          '/users/profile/edit/',
          { username: nick, comment },
          false
        )
          .then(() => {
            ErrorHandler.setToast('Profile Update Successful');
            this.render();
          })
          .catch((err) =>
            ErrorHandler.setToast(err.message || 'Profile Update Failed')
          );
      });
  }

  updateProfileImg() {
    document
      .getElementById('profileImg')
      .addEventListener('change', async (e) => {
        console.log(e.target.files[0]);
        const reqBody = new FormData();
        reqBody.append('image', e.target.files[0]);
        await Fetch.patch('/users/profile/upload/', reqBody, true)
          .then(() => {
            document.getElementById('profileImgSrc').src = URL.createObjectURL(
              e.target.files[0]
            );
            ErrorHandler.setToast('Profile Image Update Successful');
          })
          .catch((err) =>
            ErrorHandler.setToast(err.message || 'Profile Image Update Failed')
          );
      });
  }

  async afterRender() {
    this.updateProfile();
    this.updateProfileImg();
  }
}

export default Profile;
