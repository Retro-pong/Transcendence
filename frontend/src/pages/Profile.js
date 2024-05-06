import PageComponent from '@component/PageComponent.js';
import UserProfile from '@component/contents/UserProfile.js';
import openModalButton from '@component/button/OpenModalButton';
import modalComponent from '@component/modal/ModalComponent';
import editProfile from '@component/contents/EditProfile';

class Profile extends PageComponent {
  constructor() {
    super();
    this.setTitle('Profile');
  }

  async render() {
    const userProfile = UserProfile();
    const editModalBtn = openModalButton({
      text: 'EDIT PROFILE',
      classList: 'btn btn-no-outline-hover fs-8',
      modalId: '#editProfile',
    });
    const editModal = modalComponent({
      borderColor: 'pink',
      title: 'EDIT PROFILE',
      modalId: 'editProfile',
      content: editProfile({ nickname: 'hyungjpa', comment: 'hihihihi' }),
      buttonList: ['confirmBtn'],
    });

    return `
      <h1 class>PLAYER PROFILE</h1>
        ${userProfile}
      <div class="row d-flex justify-content-center">
        ${editModalBtn}
        ${editModal}
      </div>
      `;
  }
}

export default Profile;
