import FriendWaitList from '../component/modal/contents/FriendWaitList';
import NavBar from '../component/Navbar';
import PageComponent from '../component/PageComponent';
import OpenModalButton from '../component/button/OpenModalButton';
import ModalComponent from '../component/modal/ModalComponent';

class Friends extends PageComponent {
  constructor() {
    super();
    this.setTitle('Friends');
  }

  async render() {
    return `${NavBar()}
      <h1>Friends</h1>
      <p>
        This is Friends Page
      </p>
      <p>
        <a href="/" data-link>Main</a>
      </p>
      ${OpenModalButton({ text: '> WAITING', classList: 'btn btn-no-outline-hover', modalId: '#friendWaitingModal' })}
      ${ModalComponent({ borderColor: 'modal-border-mint', title: 'WAITING', modalId: 'friendWaitingModal', content: FriendWaitList(), buttonList: [] })}
    `;
  }
}

export default Friends;
