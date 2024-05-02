const NavLink = ({ text, path, classList = ['nav-link'] }) => {
  const a = document.createElement('a');
  a.href = path;
  a.className = classList.join(' ');
  a.innerHTML = text;
  a.dataset.link = text;
  return a;
};

export default NavLink;
