import NavLink from './NavLink.js';

const NavBar = () => {
  const links = [
    {
      text: 'Login',
      path: '/login',
    },
    {
      text: 'Main',
      path: '/',
    },
    {
      text: 'Profile',
      path: '/profile',
    },
    {
      text: 'Friends',
      path: '/friends',
    },
  ];

  const NavLinks = links.map((link) => NavLink(link).outerHTML).join('');

  return `<nav class="nav flex-column">
            ${NavLinks}
          </nav>`;
};

export default NavBar;
