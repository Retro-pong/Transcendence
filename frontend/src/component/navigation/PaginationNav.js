import NavLink from '@component/navigation/NavLink';

const PaginationNav = ({ currPage, totalPage }) => {
  const prevPage = currPage - 1;
  const nextPage = currPage + 1;
  const prevBtn = NavLink({
    text: '<',
    path: `/friends?_page=${prevPage}`,
    classList: 'fs-7 btn btn-no-outline-hover',
  });
  if (!prevPage) prevBtn.classList.add('disabled');
  const nextBtn = NavLink({
    text: '>',
    path: `/friends?_page=${nextPage}`,
    classList: 'fs-7 btn btn-no-outline-hover',
  });
  if (currPage === totalPage) nextBtn.classList.add('disabled');

  return `
    <div class="d-flex justify-content-center position-sticky bottom-0">
      ${prevBtn.outerHTML}
      <div class="fs-7 align-self-center">
        <span id="currPage">${currPage}</span> / <span id="totalPage">${totalPage}</span>
      </div>
      ${nextBtn.outerHTML}
    </div>
    `;
};

export default PaginationNav;
