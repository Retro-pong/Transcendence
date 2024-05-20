const Header = ({ title, subtitle = '' }) => {
  return `
      <div class="col-md-auto display-1">
        ${title}
        <span class="fs-7">
          ${subtitle}
        </span>
      </div>
  `;
};

export default Header;
