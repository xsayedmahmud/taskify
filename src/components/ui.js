const select = (selector) => document.querySelector(selector);
const menu = select('.menu');
const menuIcon = select('.menu-icon');
const contentBox = select('.contentBox');

const setContentBoxMargin = () => {
  contentBox.style.marginLeft =
    window.innerWidth <= 768 ? '0' : `${menu.offsetWidth}px`;
};

function updateUiMediaQuery() {
  menuIcon.addEventListener('click', () => {
    menu.classList.toggle('open');
    menuIcon.classList.toggle('open');
  });
}

function checkMenuState() {
  if (window.innerWidth > 768 && menu.classList.contains('open')) {
    menu.classList.remove('open');
    menuIcon.classList.remove('open');
  }
}

export { setContentBoxMargin, updateUiMediaQuery, checkMenuState };
