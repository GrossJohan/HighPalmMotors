function toggleMenu() {
  const menu = document.getElementById('mobile-menu');
  // var menu = document.getElementById("header-navbar");
  if (menu.style.display === 'none') {
    menu.style.display = 'block';
  } else {
    menu.style.display = 'none';
  }
}
