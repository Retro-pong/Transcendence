import PageComponent from '@component/PageComponent.js';
import Header from '@component/text/Header';
import OpenModalButton from '@component/button/OpenModalButton';
import ModalComponent from '@component/modal/ModalComponent';
import EditProfileForm from '@component/form/EditProfileForm';
import ProfileItem from '@component/contents/ProfileItem';
import { Modal } from 'bootstrap';
import BattleHistory from '@component/contents/BattleHistory';
import Fetch from '@/utils/Fetch';
import ToastHandler from '@/utils/ToastHandler';
import resizeImage from '@/utils/resizeImage';
import Regex from '@/constants/Regex';

class Profile extends PageComponent {
  constructor() {
    super();
    this.setTitle('Profile');
    this.hasError = false;
  }

  async getProfile() {
    return Fetch.get('/users/profile/').catch(() => {
      this.hasError = true;
      ToastHandler.setToast('Failed to get user info');
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
        if (key === 'image' || key === 'history' || key === 'is_active')
          return '';
        return `${ProfileItem({ type: key, content: profileData[key] ?? '' })}`;
      })
      .join('');

    const editModalBtn = OpenModalButton({
      text: '>> EDIT PROFILE <<',
      classList: 'btn btn-no-outline-hover fs-8',
      modalId: '#editProfileModal',
    });
    const editModal = ModalComponent({
      borderColor: 'pink',
      title: 'EDIT PROFILE',
      modalId: 'editProfileModal',
      content: EditProfileForm({
        nick: profileData.username,
        comment: profileData.comment ?? 'Please write a comment',
      }),
      buttonList: ['profileEditBtn'],
    });

    return `
        <div class="row d-flex justify-content-center">
          <div class="row d-flex flex-row mt-4">
            <div class="col-9 px-4 fs-7">
              ${profile}
            </div>
            <div class="col-3 p-2 h-90">
              <label for="profileImg" class="ratio ratio-3x4">
                <img id="profileImgSrc" src=${profileData.image} onerror="this.src='/img/profile_fallback.jpg';" class="img-fluid border border-2 border-light rounded profile-hover" alt="PROFILE IMAGE" style="object-fit: cover;"/>
              </label>
              <input type="file" accept="image/jpg, image/png" id="profileImg" class="d-none border-0">
            </div>
          </div>
          <div class="row d-flex justify-content-center">
            ${editModalBtn}
            ${editModal}
          </div>
        </div>
        <div class="row text-center fs-7">BATTLE HISTORY</div>
        <div class="row h-70">
          <div class="d-flex flex-column fs-7 border border-light overflow-auto h-80">
            <div class="d-flex">
              ${BattleHistory(profileData.username, profileData.history)}
            </div>
          </div>
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
    const editProfileModal = Modal.getOrCreateInstance('#editProfileModal');
    const editProfileForm = document.getElementById('editProfileForm');

    editProfileForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nick = document.getElementById('editNickname').value;
      const comment = document.getElementById('editComment').value;

      // 바뀐 내용 없는 경우
      if (
        nick === document.getElementById('profile-username').innerText &&
        comment === document.getElementById('profile-comment').value
      ) {
        ToastHandler.setToast('No changes made');
        return;
      }

      if (Regex.nickname.test(nick) === false) {
        ToastHandler.setToast('Invalid nickname');
        return;
      }
      if (Regex.comment.test(comment) === false) {
        ToastHandler.setToast('Invalid comment');
        return;
      }

      await Fetch.patch('/users/profile/edit/', {
        username: nick.toLowerCase(),
        comment,
      })
        .then((res) => {
          ToastHandler.setToast(res.message || 'Profile Update Successful');
          editProfileModal.hide();
          this.afterRender();
        })
        .catch((err) =>
          ToastHandler.setToast(`${err.message || 'Profile Update Failed'}`)
        );
    });
  }

  onProfileImgClick() {
    document
      .getElementById('profileImg')
      .addEventListener('change', async (e) => {
        const file = e.target.files[0];
        let resizeImg;
        // 파일 선택 안했을 때
        if (!file) {
          ToastHandler.setToast('No file selected');
          return;
        }
        // 이미지 리사이징
        try {
          resizeImg = await resizeImage(file);
        } catch (error) {
          ToastHandler.setToast('Image Upload Failed');
          return;
        }
        const formData = new FormData();
        formData.append('image', resizeImg);

        await Fetch.patch('/users/profile/upload/', formData, 'image')
          .then((res) => {
            ToastHandler.setToast(
              res.message || 'Profile Image Update Successful'
            );
            this.afterRender();
          })
          .catch((err) =>
            ToastHandler.setToast(
              `${err.message || 'Profile Image Update Failed'}`
            )
          );
      });
  }

  onEditProfileClick() {
    const editProfileModal = document.getElementById('editProfileModal');
    const nickname = document.getElementById('editNickname');
    const comment = document.getElementById('editComment');

    // 모달 열릴 때마다 기존 정보 불러오기
    editProfileModal.addEventListener('show.bs.modal', () => {
      nickname.value = document.getElementById('profile-username').innerText;
      comment.value = document.getElementById('profile-comment').value;
    });
  }

  async afterRender() {
    await this.initPageData();
    if (this.hasError) return;
    this.onEditClick();
    this.onProfileImgClick();
    this.onEditProfileClick();
  }
}

export default Profile;
