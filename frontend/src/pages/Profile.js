import PageComponent from '@component/PageComponent.js';
import Header from '@component/text/Header';
import OpenModalButton from '@component/button/OpenModalButton';
import ModalComponent from '@component/modal/ModalComponent';
import EditProfileForm from '@component/form/EditProfileForm';
import ProfileItem from '@component/contents/ProfileItem';
import { Modal } from 'bootstrap';
import Fetch from '@/utils/Fetch';
import ErrorHandler from '@/utils/ErrorHandler';
import resizeImage from '@/utils/resizeImage';
import Regex from '@/constants/Regex';

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

    // TODO: battleHistory 정보 요청
    // TODO: image url 정보 요청
    return `
        <div class="row d-flex justify-content-center">
          <div class="row d-flex flex-row mt-4">
            <div class="col-9 px-4 fs-7">
              ${profile}
            </div>
            <div class="col-3 p-2 h-90">
              <div class="h-100 w-100 d-flex justify-content-center align-items-center border border-2 border-light rounded">
                <label for="profileImg" class="h-100 w-100">
                  <img id="profileImgSrc" src=${profileData.image || '/img/profile_fallback.jpg'} width="95%" height="95%" alt="PROFILE IMAGE"/>
                </label>
                <input type="file" accept="image/jpg, image/png" id="profileImg" class="d-none border-0">
              </div>
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
        ErrorHandler.setToast('No changes made');
        return;
      }

      if (Regex.nickname.test(nick) === false) {
        ErrorHandler.setToast('Invalid nickname');
        return;
      }
      if (Regex.comment.test(comment) === false) {
        ErrorHandler.setToast('Invalid comment');
        return;
      }

      await Fetch.patch('/users/profile/edit/', { username: nick, comment })
        .then(() => {
          ErrorHandler.setToast('Profile Update Successful');
          editProfileModal.hide();
          this.afterRender();
        })
        .catch(() => ErrorHandler.setToast('Profile Update Failed'));
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
          ErrorHandler.setToast('No file selected');
          return;
        }
        // 이미지 리사이징
        try {
          resizeImg = await resizeImage(file);
        } catch (error) {
          ErrorHandler.setToast('Image Upload Failed');
          return;
        }
        const formData = new FormData();
        formData.append('image', resizeImg);

        await Fetch.patch('/users/profile/upload/', formData, 'image')
          .then(() => {
            ErrorHandler.setToast('Profile Image Update Successful');
            this.afterRender();
          })
          .catch(() => ErrorHandler.setToast('Profile Image Update Failed'));
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
    this.onEditClick();
    this.onProfileImgClick();
    this.onEditProfileClick();
  }
}

export default Profile;
