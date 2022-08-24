const mobileMenuBtnElement = document.getElementById('mobile-menu-btn');
const mobileMenuElement = document.getElementById('mobile-menu');

function toglleMobileMenu() {
    mobileMenuElement.classList.toggle('open');
};

mobileMenuBtnElement.addEventListener('click', toglleMobileMenu);