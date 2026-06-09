(function () {
  window.addEventListener('scroll', function () {
    document.querySelector('.header').classList.toggle('scrolled', window.scrollY > 40);
  });

  var menuToggle = document.querySelector('.menu-toggle');
  var headerEl   = document.querySelector('.header');
  if (!menuToggle || !headerEl) return;

  menuToggle.addEventListener('click', function () {
    var open = headerEl.classList.toggle('menu-abierto');
    this.setAttribute('aria-expanded', String(open));
  });

  document.querySelectorAll('.nav-item > a').forEach(function (a) {
    a.addEventListener('click', function (e) {
      if (window.innerWidth <= 900) {
        var ni = this.closest('.nav-item');
        if (ni.classList.contains('abierto')) {
          ni.classList.remove('abierto');
        } else {
          e.preventDefault();
          ni.classList.add('abierto');
        }
      }
    });
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav-item')) {
      document.querySelectorAll('.nav-item').forEach(function (n) { n.classList.remove('abierto'); });
    }
    if (!e.target.closest('.header')) {
      headerEl.classList.remove('menu-abierto');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
})();
