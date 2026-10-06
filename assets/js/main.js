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

// Шапка: чуть плотнее фон, когда страницу прокрутили
(function () {
  var hdr = document.querySelector('[data-hdr]');
  if (!hdr) return;
  function update() { hdr.classList.toggle('is-scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', update, { passive: true });
  update();
})();

// Лента категорий: стрелки «назад / вперёд»
(function () {
  var track = document.querySelector('[data-carousel-track]');
  if (!track) return;
  var prev = document.querySelector('[data-carousel-prev]');
  var next = document.querySelector('[data-carousel-next]');

  function step() {
    var card = track.children[0];
    var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    var per = Math.max(1, Math.floor((track.clientWidth + gap) / (card.offsetWidth + gap)) - 1);
    return per * (card.offsetWidth + gap);
  }
  function update() {
    if (!prev || !next) return;
    prev.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
  }
  if (prev) prev.addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: 'smooth' }); });
  if (next) next.addEventListener('click', function () { track.scrollBy({ left: step(), behavior: 'smooth' }); });
  track.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();

// Поиск на первом экране: подсвечивает подходящие категории в ленте
(function () {
  var form = document.querySelector('[data-search]');
  var track = document.querySelector('[data-carousel-track]');
  if (!form || !track) return;
  var empty = document.querySelector('[data-search-empty]');
  var cards = Array.prototype.slice.call(track.querySelectorAll('.cc'));

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var words = form.q.value.toLowerCase().replace(/ё/g, 'е').split(/[^a-zа-я0-9]+/).filter(function (w) { return w.length > 2; });
    var hits = [];
    cards.forEach(function (card) {
      var hay = (card.textContent + ' ' + (card.getAttribute('data-q') || '')).toLowerCase().replace(/ё/g, 'е');
      // совпадение по началу слова: «обув» найдёт «обувь»
      var hit = words.length > 0 && words.some(function (w) { return hay.indexOf(w.slice(0, Math.max(4, w.length - 2))) !== -1; });
      card.classList.toggle('is-hit', hit);
      if (hit) hits.push(card);
    });
    cards.forEach(function (card) { card.classList.toggle('is-dim', hits.length > 0 && hits.indexOf(card) === -1); });
    if (empty) empty.hidden = !(words.length && !hits.length);

    document.getElementById('categories').scrollIntoView({ behavior: 'smooth' });
    if (hits.length) {
      var li = hits[0].parentElement;
      track.scrollTo({ left: li.offsetLeft - track.firstElementChild.offsetLeft, behavior: 'smooth' });
    }
  });
  form.q.addEventListener('input', function () {
    if (form.q.value) return;
    cards.forEach(function (card) { card.classList.remove('is-hit', 'is-dim'); });
    if (empty) empty.hidden = true;
  });
})();
