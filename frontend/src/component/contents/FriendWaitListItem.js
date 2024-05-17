import Fetch from '@/utils/Fetch';

const FriendWaitListItem = ({ nick }) => {
  const item = document.createElement('div');
  item.classList.add('row', 'my-2');

  const col1 = document.createElement('div');
  const col2 = document.createElement('div');
  const col3 = document.createElement('div');
  col1.classList.add(
    'col-8',
    'd-flex',
    'align-items-center',
    'justify-content-start',
    'fs-8'
  );
  col2.classList.add(
    'col-2',
    'd-flex',
    'align-items-center',
    'justify-content-center'
  );
  col3.classList.add(
    'col-2',
    'd-flex',
    'align-items-center',
    'justify-content-center'
  );

  const acceptBtn = document.createElement('button');
  const rejectBtn = document.createElement('button');

  acceptBtn.classList.add('btn', 'btn-friend-accept', 'rounded-5', 'fs-8');
  rejectBtn.classList.add('btn', 'btn-friend-reject', 'rounded-5', 'fs-8');

  col1.innerText = nick;
  acceptBtn.innerText = 'OK';
  rejectBtn.innerText = 'NO';

  col2.appendChild(acceptBtn);
  col3.appendChild(rejectBtn);

  item.appendChild(col1);
  item.appendChild(col2);
  item.appendChild(col3);

  // TODO: api 연결 후 로직 추가
  acceptBtn.addEventListener('click', async () => {
    try {
      await Fetch.post('/friend-accept', { nick });
      console.log('친구 수락 성공');
    } catch (err) {
      console.error('친구 수락 실패');
    }
  });

  rejectBtn.addEventListener('click', async () => {
    try {
      await Fetch.post('/friend-reject', { nick });
      console.log('친구 거절 성공');
    } catch (err) {
      console.error('친구 거절 실패');
    }
  });

  return item;
};

export default FriendWaitListItem;
