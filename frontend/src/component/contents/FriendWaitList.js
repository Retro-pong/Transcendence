import FriendWaitListItem from '@component/contents/FriendWaitListItem';

const FriendWaitList = () => {
  const waitList = ['HYUNGJPA', 'HYOBICHO', 'WONJILEE', 'SUBINLEE'];

  return `
    <div class="container p-3">
      <div class="inner-container vh-50 px-5 py-3 border border-9 border-light rounded">
        ${waitList.map((friendNick) => FriendWaitListItem({ nick: friendNick })).join('')}
      </div>
    </div>
  `;
};

export default FriendWaitList;
