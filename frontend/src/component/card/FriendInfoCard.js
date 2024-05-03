const FriendInfoCard = () => {
  return `
    <div class="card text-bg-dark border-5 border-light rounded-5 p-3" style="width: 30rem;">
      <div class="row g-0">
        <div class="col-md-8">
          <div class="card-body fs-4 text-break">
            <div class="row card-text">
              <p class="card-text ">name: name</p>
            </div>
            <div class="row">
              <p class="card-text ">win/lose: 1/99</p>
            </div>
            <div class="row">
              <p class="card-text ">comment: hello</p>
            </div>
            <div class="row">
              <p class="card-text position-relative">status: online <span class="position-absolute p-2 text-bg-secondary rounded-circle bg-success ms-1" style="top: 27%;" /></p>
            </div>
          </div>
        </div>
        <div class="col-md-4 align-content-center">
          <img src="https://www.blueconomy.co.kr/news/photo/202402/2399_3001_921.png" class="img-fluid" alt="profile" />
        </div>
      </div>
    </div>
  `;
};

export default FriendInfoCard;
