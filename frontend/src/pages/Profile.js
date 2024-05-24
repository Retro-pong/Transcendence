import PageComponent from '@component/PageComponent.js';
import Header from '@component/text/Header';
import OpenModalButton from '@component/button/OpenModalButton';
import ModalComponent from '@component/modal/ModalComponent';
import EditProfileForm from '@component/form/EditProfileForm';
import ProfileItem from '@component/contents/ProfileItem';
import ProfileBattleHistory from '@component/contents/ProfileBattleHistory';
import Fetch from '@/utils/Fetch';
import ErrorHandler from '@/utils/ErrorHandler';

class Profile extends PageComponent {
  constructor() {
    super();
    this.setTitle('Profile');
  }

  async getProfile() {
    return Fetch.get('/users/profile/').catch(() => {
      ErrorHandler.setToast('Failed to get user info');
      return [];
    });
  }

  async getPageData() {
    const profileData = await this.getProfile();

    if (profileData.length === 0) {
      return `
        <div class="d-flex justify-content-center align-items-center h-100">
          <div class="fs-11"> No User Profile :( </div>
        </div>
      `;
    }

    const profile = Object.keys(profileData)
      .map((key) => {
        if (key === 'image' || key === 'battleHistory' || key === 'is_active')
          return '';
        return `${ProfileItem({ type: key, content: profileData[key] })}`;
      })
      .join('');

    const editModalBtn = OpenModalButton({
      text: '>> EDIT PROFILE <<',
      classList: 'btn btn-no-outline-hover fs-8',
      modalId: '#editProfile',
    });
    const editModal = ModalComponent({
      borderColor: 'pink',
      title: 'EDIT PROFILE',
      modalId: 'editProfile',
      content: EditProfileForm({
        nick: profileData.username,
        comment: profileData.comment ?? 'Please write a comment',
      }),
      buttonList: ['profileEditBtn'],
    });

    // TODO: battleHistory 정보 추가
    return `
        <div class="row d-flex justify-content-center">
          <div class="row d-flex flex-row mt-4">
            <div class="col-9 px-4 fs-7">
              ${profile}
            </div>
            <div class="col-3 p-2 h-90">
              <label for="profileImg" class="h-100 w-100">
                <img id="profileImgSrc" src='/img/map_mountain.jpg' class="border border-3 rounded" width="100%" height="100%" alt="IMG"/>
              </label>
              <input type="file" accept="image/jpg, image/png" id="profileImg" class="d-none border-0">
            </div>
          </div>
          <div class="row d-flex justify-content-center">
            ${editModalBtn}
            ${editModal}
          </div>
        </div>
          <div class="row my-4">
            <div class="d-flex justify-content-center fs-8 border border-light">BATTLE HISTORY</div>
          </div>
    `;
  }

  async render() {
    return `
      ${Header({ title: 'PLAYER PROFILE' })}
      <div id="pageBody" class="container h-75 w-80">
      </div>
    `;
  }

  async initPageData() {
    const pageBody = document.getElementById('pageBody');
    pageBody.innerHTML = await this.getPageData();
  }

  onEditClick() {
    document
      .getElementById('editProfileForm')
      .addEventListener('submit', async (e) => {
        e.preventDefault();
        const nick = document.getElementById('editNickname').value;
        const comment = document.getElementById('editComment').value;
        await Fetch.patch('/users/profile/edit/', { username: nick, comment })
          .then(() => {
            ErrorHandler.setToast('Profile Update Successful');
            this.render();
          })
          .catch((err) =>
            ErrorHandler.setToast(err.message || 'Profile Update Failed')
          );
      });
  }

  onProfileImgClick() {
    document
      .getElementById('profileImg')
      .addEventListener('change', async (e) => {
        const reqBody = new FormData();
        reqBody.append('image', e.target.files[0]);
        await Fetch.patch('/users/profile/upload/', reqBody, 'form')
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

  onEditProfileClick() {
    const editProfileModal = document.getElementById('editProfile');
    const nickname = document.getElementById('editNickname');
    const comment = document.getElementById('editComment');

    editProfileModal.addEventListener('show.bs.modal', () => {
      nickname.value = document.getElementById('profile-username').innerText;
      comment.value =
        document.getElementById('profile-comment').innerText ||
        'Please write a comment';
    });
  }

  async afterRender() {
    await this.initPageData();
    this.onEditClick();
    this.onProfileImgClick();
    this.onEditProfileClick();
  }
}

export default Profile;
