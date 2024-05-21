import BasicButton from '@component/button/BasicButton';

const Pagination = ({ currPage, totalPage }) => {
  const prevBtn = BasicButton({
    id: 'prevBtn',
    text: '<',
    classList: 'fs-7 btn btn-no-outline-hover',
    disabled: currPage === 1,
  });
  const nextBtn = BasicButton({
    id: 'nextBtn',
    text: '>',
    classList: 'fs-7 btn btn-no-outline-hover',
    disabled: totalPage === currPage,
  });

  return `
    <div class="d-flex justify-content-center">
      ${prevBtn}
      <div class="fs-7 align-self-center">
        <span id="currPage">${currPage}</span> / <span id="totalPage">${totalPage}</span>
      </div>
      ${nextBtn}
    </div>
    `;
};

export default Pagination;
