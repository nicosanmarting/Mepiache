(function () {
  var WA_NUM  = (window.MEPIACHE && MEPIACHE.wa) ? MEPIACHE.wa : '56963914909';
  var overlay = document.getElementById('contactoOverlay');
  var drawer  = document.getElementById('contactoDrawer');
  var trigger = document.getElementById('contactoTrigger');
  var cerrar  = document.getElementById('contactoCerrar');
  if (!overlay || !drawer) return;

  function abrir(tabId) {
    drawer.classList.add('abierto');
    overlay.classList.add('activo');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (tabId) cambiarTab(tabId);
  }

  function cerrarDrawer() {
    drawer.classList.remove('abierto');
    overlay.classList.remove('activo');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function cambiarTab(tabId) {
    document.querySelectorAll('.contacto-tab-btn').forEach(function (btn) {
      btn.classList.toggle('activo', btn.dataset.tab === tabId);
    });
    document.querySelectorAll('.contacto-tab-panel').forEach(function (panel) {
      panel.classList.toggle('activo', panel.id === 'tab-' + tabId);
    });
  }

  if (trigger) trigger.addEventListener('click', function () { abrir(); });
  if (cerrar)  cerrar.addEventListener('click', cerrarDrawer);
  overlay.addEventListener('click', cerrarDrawer);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') cerrarDrawer();
  });

  document.querySelectorAll('.contacto-tab-btn').forEach(function (btn) {
    btn.addEventListener('click', function () { cambiarTab(btn.dataset.tab); });
  });

  document.querySelectorAll('.js-abrir-empresas').forEach(function (btn) {
    btn.addEventListener('click', function () { abrir('empresas'); });
  });

  var FORMSPREE_ID = 'mrevkwgl';

  function enviarFormspree(datos) {
    fetch('https://formspree.io/f/' + FORMSPREE_ID, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(datos)
    }).catch(function () { /* silencioso — WhatsApp sigue funcionando igual */ });
  }

  var formGeneral = document.getElementById('form-general');
  if (formGeneral) {
    formGeneral.addEventListener('submit', function (e) {
      e.preventDefault();
      var nombre  = document.getElementById('gen-nombre').value.trim();
      var email   = document.getElementById('gen-email').value.trim();
      var tel     = document.getElementById('gen-telefono').value.trim();
      var mensaje = document.getElementById('gen-mensaje').value.trim();
      // Enviar a Formspree (email)
      enviarFormspree({ nombre: nombre, email: email, telefono: tel, mensaje: mensaje, tipo: 'general' });
      // Abrir WhatsApp igual que antes
      var texto = 'Hola Mepiache, mi nombre es ' + nombre + '.';
      if (email)  texto += '\nCorreo: ' + email;
      if (tel)    texto += '\nTeléfono: ' + tel;
      texto += '\n\n' + mensaje;
      window.open('https://wa.me/' + WA_NUM + '?text=' + encodeURIComponent(texto), '_blank');
    });
  }

  var formEmpresas = document.getElementById('form-empresas');
  if (formEmpresas) {
    formEmpresas.addEventListener('submit', function (e) {
      e.preventDefault();
      var nombre   = document.getElementById('emp-nombre').value.trim();
      var empresa  = document.getElementById('emp-empresa').value.trim();
      var email    = document.getElementById('emp-email').value.trim();
      var tel      = document.getElementById('emp-telefono').value.trim();
      var producto = document.getElementById('emp-producto').value;
      var mensaje  = document.getElementById('emp-mensaje').value.trim();
      // Enviar a Formspree (email)
      enviarFormspree({ nombre: nombre, empresa: empresa, email: email, telefono: tel, producto: producto, mensaje: mensaje, tipo: 'empresas' });
      // Abrir WhatsApp igual que antes
      var texto = 'Hola Mepiache, soy ' + nombre;
      if (empresa) texto += ' de ' + empresa;
      texto += '.';
      if (email)   texto += '\nCorreo: ' + email;
      if (tel)     texto += '\nTeléfono: ' + tel;
      if (producto) texto += '\nProducto de interés: ' + producto;
      texto += '\n\n' + mensaje;
      window.open('https://wa.me/' + WA_NUM + '?text=' + encodeURIComponent(texto), '_blank');
    });
  }

  window.abrirContacto = abrir;
})();
