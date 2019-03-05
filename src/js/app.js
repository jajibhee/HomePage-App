//Grab the element containing the nav icon first
const menuBtn = document.querySelector(" .mobile_icon");
const menuItem = document.querySelector(".menu__item");

let showNav = false;

menuBtn.addEventListener("click", toggleMenu);

function toggleMenu() {
  if (!showNav) {
    menuBtn.classList.add("show");
    menuItem.classList.add("show");

    showNav = true;
  } else {
    menuBtn.classList.remove("show");
    menuItem.classList.remove("show");

    showNav = false;
  }
}
