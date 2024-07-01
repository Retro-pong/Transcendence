const FriendSearch = () => {
  return `
    <div class="container px-5 w-100 h-100 d-flex flex-column align-items-center">
      <div class="row w-100 h-25 px-3 border border-9 border-light rounded">
        <span class="col-2 fs-8 text-center">-></span>
        <input id="searchFriend" type="text" class="col-10 text-light bg-transparent fs-8 border-0 px-5"/>
      </div>
      <div id="friendSearchListContainer" class="row row-cols-1 d-flex flex-column flex-nowrap w-100 vh-50 overflow-y-scroll my-5 px-3 py-3 border border-9 border-light rounded">
      </div>
    </div>
  `;
};

export default FriendSearch;
