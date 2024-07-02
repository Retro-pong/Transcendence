const FriendInfoCard = ({
  id,
  name,
  win,
  lose,
  comment,
  isActive,
  profileImg,
}) => {
  const status = isActive
    ? {
        color: 'bg-success',
        text: 'online',
      }
    : {
        color: 'bg-danger',
        text: 'offline',
      };
  const commentMessage = comment || '...';
  return `
  <div class="col d-flex justify-content-center align-self-center">
    <div class="card text-bg-dark border-5 border-light justify-content-center rounded-5 p-3 pt-0 my-1 position-relative friend-hover" style="width: 33rem; min-width: 33rem;">
      <div class="row g-0 align-self-end">
        <button class="btn-close fs-4 pt-1" data-nick="${name}" data-id="friend${id}">x</button>
      </div>
      <div id="friend${id}" class="row g-0" data-bs-toggle="modal" data-bs-target="#friendDetailModal">
        <div class="col-md-8 align-self-center">
          <div class="card-body fs-4 text-break">
            <div class="row">
              <p class="card-text ">name: ${name}</p>
            </div>
            <div class="row">
              <p class="card-text ">win/lose: ${win}/${lose}</p>
            </div>
            <div class="row">
              <p class="card-text text-truncate">comment: ${comment}</p>
            </div>
            <div class="row">
              <p class="card-text position-relative">status: ${status.text} <span class="position-absolute p-2 text-bg-secondary rounded-circle ${status.color} ms-1" style="top: 27%;" /></p>
            </div>
          </div>
        </div>
        <div class="col-md-4 align-content-center">
          <div class="ratio ratio-1x1">
            <img src=${profileImg} onerror="this.src='/img/profile_fallback.jpg';" class="rounded-3" data-bs-toggle="tooltip" data-bs-custom-class="tooltip-comment" data-bs-title="${commentMessage}" alt="profile" style="object-fit: cover;" />
          </div>
        </div>
      </div>
    </div>
  </div>
  `;
};

export default FriendInfoCard;
