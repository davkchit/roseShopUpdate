// Мобильное меню
(function () {
  var menu = document.getElementById('menu');
  var openBtn = document.querySelector('[data-menu-open]');
  if (!menu || !openBtn) return;

  function setOpen(open) {
    menu.hidden = !open;
    openBtn.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  }

  openBtn.addEventListener('click', function () { setOpen(true); });
  menu.querySelectorAll('[data-menu-close]').forEach(function (el) {
    el.addEventListener('click', function () { setOpen(false); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !menu.hidden) setOpen(false);
  });
  window.addEventListener('resize', function () {
    // бургер скрыт на этой ширине — меню закрываем
    if (!menu.hidden && getComputedStyle(openBtn).display === 'none') setOpen(false);
  });
})();
