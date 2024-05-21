import OpenModalButton from '@component/button/OpenModalButton';
import ModalComponent from '@component/modal/ModalComponent';
import EditProfileForm from '@component/form/EditProfileForm';

const ProfilePageButtons = () => {
  const editModalBtn = OpenModalButton({
    text: '>> EDIT PROFILE <<',
    classList: 'btn btn-no-outline-hover fs-8',
    modalId: '#editProfileForm',
  });
  const editModal = ({ nick, comment }) =>
    ModalComponent({
      borderColor: 'pink',
      title: 'EDIT PROFILE',
      modalId: 'editProfile',
      content: EditProfileForm({ nick, comment }),
      buttonList: ['confirmBtn'],
    });

  const BtnList = [`${editModalBtn} ${editModal}`];

  return `
		${BtnList.join('')}
	`;
};

export default ProfilePageButtons;
