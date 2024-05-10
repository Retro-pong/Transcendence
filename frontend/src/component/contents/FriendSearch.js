import FriendSearchListItem from '@component/contents/FriendSearchListItem';

const FriendSearch = () => {
  const list = ['hyungjpa', 'hyobicho', 'wonjilee', 'subinlee'];

  return `
    <div class="container px-5">
      <div class="row px-3 border border-9 border-light rounded">
        <span class="col-2 fs-8">-></span>
        <input id="friendSearch" class="col-10 text-light bg-transparent fs-8 border-0 px-5"/>
      </div>
      <div class="row my-5 px-5 py-3 border border-9 border-light rounded">
        ${list.map((friend) => FriendSearchListItem({ friend })).join('')}
      </div>
    </div>
  `;
};

export default FriendSearch;
