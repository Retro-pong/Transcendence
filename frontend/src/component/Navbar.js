import NavLink from '@component/NavLink.js';

const NavBar = () => {
  const links = [
    {
      text: 'Login',
      path: '/login',
    },
    {
      text: 'Home',
      path: '/',
    },
    {
      text: 'Profile',
      path: '/profile',
    },
  ];

  const NavLinks = links.map((link) => NavLink(link).outerHTML).join('');

  return `<nav class="nav flex-column">
            ${NavLinks}
          </nav>`;
};

export default NavBar;
