import Fetch from '@/utils/Fetch';

const FriendSearchListItem = ({ nick }) => {
  const item = document.createElement('div');
  const col = document.createElement('div');
  const addFriendBtn = document.createElement('button');

  item.classList.add('row', 'my-2', 'px-5');
  col.classList.add('col-10', 'fs-10');
  col.innerText = nick;
  addFriendBtn.classList.add(
    'btn',
    'fs-8',
    'col-2',
    'btn-no-outline-hover',
    'bg-transparent'
  );
  addFriendBtn.innerText = '+';

  item.appendChild(col);
  item.appendChild(addFriendBtn);

  // TODO: api 연결 후 로직 추가
  addFriendBtn.addEventListener('click', async () => {
    try {
      await Fetch.post('/friend-add-new', { nick });
      console.log('친구 추가 성공');
    } catch (error) {
      console.error('친구 추가 실패');
    }
  });

  return item;
};

export default FriendSearchListItem;
