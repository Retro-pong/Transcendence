import BasicButton from '@component/button/BasicButton.js';

const FriendSearchListItem = ({ friend }) => {
  return `
    <div class="row my-2 px-5">
      <div class="col-10 fs-10">${friend}</div>
      ${BasicButton({
        text: '+',
        classList: 'col-2 btn btn-no-outline-hover fs-8',
      })}
    </div>
    `;
};

export default FriendSearchListItem;
