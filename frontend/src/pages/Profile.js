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

  async getUserInfo() {
    const userProfileInfo = await fetch('http://localhost:8080/userInfo').then(
      (res) => res.json()
    );
    return userProfileInfo;
  }

  async render() {
    const editModalBtn = openModalButton({
      text: 'EDIT PROFILE',
      classList: 'btn btn-no-outline-hover fs-8',
      modalId: '#editProfile',
    });
    const editModal = ({ nickname, comment }) =>
      modalComponent({
        borderColor: 'pink',
        title: 'EDIT PROFILE',
        modalId: 'editProfile',
        content: editProfile({ nickname, comment }),
        buttonList: ['confirmBtn'],
      });

    const dummyUser = await this.getUserInfo();

    return `
      <h1 class="fs-15">PLAYER PROFILE</h1>
      <div class="container w-75">
        <div class="row d-flex justify-content-center">
          ${UserProfile({
            nickname: dummyUser.nickname,
            email: dummyUser.email,
            winLose: `${dummyUser.win} / ${dummyUser.lose}`,
            comment: dummyUser.comment,
            img: dummyUser.img,
            battle: dummyUser.battleHistory,
          })}
        </div>
        <div class="row d-flex justify-content-center">
          ${editModalBtn}
          ${editModal({ nickname: dummyUser.nickname, comment: dummyUser.comment })}
        </div>
      </div>
      `;
  }
}

export default Profile;
