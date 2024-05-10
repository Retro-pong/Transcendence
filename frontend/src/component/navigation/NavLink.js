const NavLink = ({ text, path, classList = 'nav-link fs-13' }) => {
  const a = document.createElement('a');
  a.href = path;
  a.className = classList;
  a.innerHTML = text;
  a.dataset.link = text;
  return a;
};

export default NavLink;
