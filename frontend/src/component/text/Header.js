const Header = ({ title, subtitle = '', classList = '' }) => {
  return `
    <div class="row ${classList}">
      <div class="col-md-auto display-1">
        ${title}
        <span class="fs-7">
          ${subtitle}
        </span>
      </div>
    </div>
  `;
};

export default Header;
