//Grab the element containing the nav icon first
const menuBtn = document.querySelector(".menu-mobile_icon");
const navItem = document.querySelector(".sidebar__nav");
const list = document.querySelector(".agenda__list");
const lesson = document.querySelector(".agenda img");

//add an event listener on the icon
menuBtn.addEventListener("click", toggleMenu);

function toggleMenu() {
  navItem.classList.toggle("show");
}

lesson.addEventListener("click", toggleLesson);

function toggleLesson() {
  list.classList.toggle("show");
}
// let myListHeight;

// function toggleLesson() {
//   if (!list.classList.contains("show")) {
//     list.classList.add("show");
//     let listHeight = list.clientHeight;
//     myListHeight = listHeight;
//     list.style.height = 0;

//     setTimeout(function() {
//       list.style.height = listHeight + "px";
//     }, 100);
//   } else {
//     list.classList.remove("show");
//     setTimeout(function() {
//       list.style.height = 0 + "px";

//       setTimeout(function() {
//         list.style.height = myListHeight + "px";
//       }, 200);
//     }, 100);
//   }
// }
