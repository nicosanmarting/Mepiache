/**
 * ══════════════════════════════════════════════════════════════════
 *  MEPIACHE — Configuración central del sitio
 *
 *  Edita SOLO este archivo para actualizar datos de contacto,
 *  redes sociales, ubicación o precios. Los cambios se aplican
 *  automáticamente en todas las páginas del sitio.
 * ══════════════════════════════════════════════════════════════════
 */

var MEPIACHE = {

  /* ── Contacto ────────────────────────────────────────────────────
     wa: número sin + ni espacios (solo dígitos, con código de país) */
  wa:        '56963914909',
  telefono:  '+56 9 6391 4909',
  email:     'contacto@mepiache.cl',

  /* ── Redes sociales ────────────────────────────────────────────── */
  instagram: 'https://instagram.com/heladeria.mepiache',

  /* ── Ubicación ─────────────────────────────────────────────────── */
  direccion:  'Álvarez de Toledo 410, San Joaquín, Santiago',
  gmaps:      'https://www.google.com/maps/place/MEPIACHE+Ltda/@-33.4920769,-70.6336537,829m/data=!3m1!1e3!4m6!3m5!1s0x9662dab1fd8597ef:0xe120444253fe02da!8m2!3d-33.4922046!4d-70.6336706!16s%2Fg%2F1tkspktc',
  gmapsEmbed: 'https://maps.google.com/maps?q=-33.4922046,-70.6336706&hl=es&z=16&output=embed',

  /* ── Textos del sitio ──────────────────────────────────────────── */
  tagline:   'Helados artesanales con historia desde 1954',
  copyright: '© 2026 Mepiache. Todos los derechos reservados.',

  /* ── Precios ───────────────────────────────────────────────────── */
  precioSustancia: '$5.000 CLP',

  /* ── Horarios ──────────────────────────────────────────────────── */
  horario: {
    semana: 'Lunes a Viernes · 9:00 – 18:00',
    finde:  'Sábado · 9:00 – 14:00 · Domingo cerrado',
  },

  /* ── Disponibilidad de sabores ─────────────────────────────────── */
  dispDefaults: {
    paletas:    'disponible',
    '5litros':  'disponible',
    '10litros': 'encargo',
    gelato:     'disponible',
    sustancias: 'temporada',
  },
  dispOverrides: {
    'chirimoya-alegre':       'temporada',
    'chirimoya-alegre-10l':   'temporada',
    'lucuma-manjar':          'temporada',
    'lucuma-10l':             'temporada',
    'pistacho-italiano':      'encargo',
    'sustancia-tradicional':  'temporada',
    'helados-invierno':       'temporada',
    'confites-tradicionales': 'temporada',
    'formato-individual':     'temporada',
    'formato-compartir':      'temporada',
  },

  /* ── Sabores ocultos (temporalmente fuera de carta) ───────────── */
  saboresOcultos: [
    // Agrega claves aquí para ocultar un sabor del sitio:
    // 'pistacho', 'banana-split',
  ],

};

/* ══════════════════════════════════════════════════════════════════
   Inicialización automática — no es necesario editar abajo de aquí
   ══════════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function () {

  /* WhatsApp: reemplaza número en todos los links del sitio */
  document.querySelectorAll('a[href*="wa.me"]').forEach(function (a) {
    a.href = a.href.replace(/wa\.me\/\d+/, 'wa.me/' + MEPIACHE.wa);
  });

  /* Teléfono: links tel: */
  document.querySelectorAll('a[href^="tel:"]').forEach(function (a) {
    a.href = 'tel:+' + MEPIACHE.wa;
  });

  /* Email: links mailto: */
  document.querySelectorAll('a[href^="mailto:"]').forEach(function (a) {
    a.href = 'mailto:' + MEPIACHE.email;
  });

  /* Instagram */
  document.querySelectorAll('a[href*="instagram.com"]').forEach(function (a) {
    a.href = MEPIACHE.instagram;
  });

  /* Google Maps — link de texto */
  document.querySelectorAll('[data-gmaps]').forEach(function (a) {
    a.href = MEPIACHE.gmaps;
  });

  /* Google Maps — iframe embed */
  document.querySelectorAll('[data-gmaps-embed]').forEach(function (f) {
    f.src = MEPIACHE.gmapsEmbed;
  });

  /* Textos configurables via data-config="clave" */
  var textos = {
    'tagline':          MEPIACHE.tagline,
    'direccion':        MEPIACHE.direccion,
    'copyright':        MEPIACHE.copyright,
    'telefono':         MEPIACHE.telefono,
    'email':            MEPIACHE.email,
    'precio-sustancia': MEPIACHE.precioSustancia,
    'horario-semana':   MEPIACHE.horario.semana,
    'horario-finde':    MEPIACHE.horario.finde,
  };
  Object.keys(textos).forEach(function (clave) {
    document.querySelectorAll('[data-config="' + clave + '"]').forEach(function (el) {
      el.textContent = textos[clave];
    });
  });

});
