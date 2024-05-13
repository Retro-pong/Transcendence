const FriendSearch = () => {
  return `
    <div class="container px-5">
      <div class="row px-3 border border-9 border-light rounded">
        <span class="col-2 fs-8">-></span>
        <input id="searchFriend" type="text" class="col-10 text-light bg-transparent fs-8 border-0 px-5"/>
      </div>
      <div id="friendSearchListContainer" class="row vh-50 overflow-y-scroll my-5 px-5 py-3 border border-9 border-light rounded">
      </div>
    </div>
  `;
};

export default FriendSearch;
