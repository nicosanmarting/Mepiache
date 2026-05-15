(function () {
  'use strict';

  var WA_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.122 1.535 5.854L.057 23.571a.75.75 0 00.914.914l5.674-1.472A11.942 11.942 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.713 9.713 0 01-4.951-1.355l-.355-.21-3.668.952.978-3.584-.23-.368A9.713 9.713 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/></svg>';

  var DISP_INFO = {
    'disponible':     { label: 'Disponible ahora',       cls: 'disp-disponible' },
    'temporada':      { label: 'Solo en temporada',      cls: 'disp-temporada'  },
    'encargo':        { label: 'Por encargo',            cls: 'disp-encargo'    },
    'no-disponible':  { label: 'No disponible por ahora', cls: 'disp-temporada' }
  };

  var TAG_LABELS = {
    'vegano':    '🌱 Vegano',
    'premium':   '✦ Premium',
    'sin-azucar':'○ Sin azúcar',
    'frutal':    '🍓 Frutal',
    'crema':     '🍦 Cremoso'
  };

  function getDispKey(prod, tabId) {
    var M = window.MEPIACHE || {};
    if (M.dispOverrides && M.dispOverrides[prod._id]) return M.dispOverrides[prod._id];
    if (prod.disponible === false) return 'no-disponible';
    if (typeof prod.disponible === 'string') return prod.disponible;
    if (M.dispDefaults && M.dispDefaults[tabId]) return M.dispDefaults[tabId];
    return 'disponible';
  }

  function getTags(filtros) {
    var tags = [];
    if (!filtros) return tags;
    if (filtros.vegano)    tags.push('vegano');
    if (filtros.premium)   tags.push('premium');
    if (filtros.sinAzucar) tags.push('sin-azucar');
    if (filtros.frutal)    tags.push('frutal');
    if (filtros.cremoso)   tags.push('crema');
    return tags;
  }

  function buildChipIcons(tags) {
    var icons = '';
    if (tags.indexOf('vegano') !== -1)   icons += '<span class="chip-tag chip-tag-vegano">🌱</span>';
    if (tags.indexOf('premium') !== -1)  icons += '<span class="chip-tag chip-tag-premium">✦</span>';
    if (tags.indexOf('sin-azucar') !== -1 && tags.indexOf('vegano') === -1) icons += '<span class="chip-tag chip-tag-sinaz">○</span>';
    return icons;
  }

  function buildNutriTable(n, porcion) {
    if (!n) return '';
    porcion = porcion || '100 g';
    var kj = Math.round(n.e * 4.184);
    var rows = [
      ['Valor energético',           n.e + ' kcal · ' + kj + ' kJ', false],
      ['Grasas totales',             n.g + ' g',                     false],
      ['de las cuales saturadas',    n.s + ' g',                     true ],
      ['Hidratos de carbono',        n.hc + ' g',                    false],
      ['de los cuales azúcares',     n.az + ' g',                    true ],
      ['Proteínas',                  n.p + ' g',                     false],
      ['Sal',                        n.sal + ' g',                   false]
    ];
    var tbody = rows.map(function (r) {
      return '<tr' + (r[2] ? ' class="nutri-sub"' : '') + '><td>' + r[0] + '</td><td>' + r[1] + '</td></tr>';
    }).join('');
    return '<details class="nutri-panel">' +
      '<summary>📊 Ver tabla nutricional (por ' + porcion + ')</summary>' +
      '<div class="nutri-inner"><table class="nutri-table"><tbody>' + tbody + '</tbody></table>' +
      '<p class="nutri-disclaimer">* Valores referenciales. Varían según lote y temporada.</p>' +
      '</div></details>';
  }

  function buildDetallePanel(tabId) {
    return '<div class="sabor-detalle" id="detalle-' + tabId + '" hidden>' +
      '<div class="sabor-detalle-header">' +
        '<div>' +
          '<span class="sabor-detalle-tipo"></span>' +
          '<h4 class="sabor-detalle-nombre"></h4>' +
          '<span class="sabor-disp"></span>' +
        '</div>' +
        '<button type="button" class="sabor-detalle-cerrar" aria-label="Cerrar">×</button>' +
      '</div>' +
      '<p class="sabor-detalle-desc"></p>' +
      '<p class="sabor-detalle-meta"><strong>Ingredientes:</strong> <span class="ing-val"></span></p>' +
      '<p class="sabor-detalle-meta"><strong>Alérgenos:</strong> <span class="alerg-val"></span></p>' +
      '<div class="nutri-wrap"></div>' +
    '</div>';
  }

  function llenarPanel(detalleEl, prod, tabId) {
    detalleEl.querySelector('.sabor-detalle-tipo').textContent   = prod.tipo || '';
    detalleEl.querySelector('.sabor-detalle-nombre').textContent = prod.nombre || '';
    detalleEl.querySelector('.sabor-detalle-desc').textContent   = prod.descripcion || '';
    detalleEl.querySelector('.ing-val').textContent   = prod.ingredientes || '—';
    detalleEl.querySelector('.alerg-val').textContent = prod.alergenos || '—';

    var nutriWrap = detalleEl.querySelector('.nutri-wrap');
    if (nutriWrap) {
      nutriWrap.innerHTML = prod.tablaNutricional
        ? buildNutriTable(prod.tablaNutricional, prod.tablaNutricional.porcion)
        : '';
    }

    var dispEl = detalleEl.querySelector('.sabor-disp');
    if (dispEl) {
      var key  = getDispKey(prod, tabId);
      var info = DISP_INFO[key] || DISP_INFO['disponible'];
      dispEl.className   = 'sabor-disp ' + info.cls;
      dispEl.textContent = info.label;
    }
  }

  function cambiarImagen(tabId, prod, tabDefaultImgs) {
    var bloque = document.getElementById('tab-' + tabId);
    if (!bloque) return;
    var img = bloque.querySelector('.categoria-imagen img');
    if (!img) return;
    if (!img.dataset.srcOriginal) img.dataset.srcOriginal = img.getAttribute('src');
    var newSrc = prod.imagen || tabDefaultImgs[tabId];
    if (!newSrc || img.getAttribute('src') === newSrc) return;
    img.style.opacity = '0';
    setTimeout(function () { img.setAttribute('src', newSrc); img.style.opacity = '1'; }, 220);
  }

  function restaurarImagen(tabId) {
    var bloque = document.getElementById('tab-' + tabId);
    if (!bloque) return;
    var img = bloque.querySelector('.categoria-imagen img');
    if (!img || !img.dataset.srcOriginal) return;
    if (img.getAttribute('src') === img.dataset.srcOriginal) return;
    img.style.opacity = '0';
    setTimeout(function () { img.setAttribute('src', img.dataset.srcOriginal); img.style.opacity = '1'; }, 220);
  }

  function buildFilterBar(tabId, chips, contenido) {
    var tagSet = {};
    chips.forEach(function (c) {
      (c.dataset.tags || '').split(' ').forEach(function (t) { if (t) tagSet[t] = true; });
    });
    var relevantes = Object.keys(tagSet).filter(function (t) { return TAG_LABELS[t]; });
    if (relevantes.length < 2) return;

    var bar = document.createElement('div');
    bar.className = 'filtros-bar';
    bar.innerHTML = '<span class="filtros-label">Filtrar</span>';

    function makeFilterBtn(filtro, label) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'filtro-btn';
      b.dataset.filtro = filtro;
      b.textContent = label;
      if (filtro === 'todos') b.classList.add('activo');
      b.addEventListener('click', function () {
        bar.querySelectorAll('.filtro-btn').forEach(function (x) { x.classList.remove('activo'); });
        b.classList.add('activo');
        var f = b.dataset.filtro;
        chips.forEach(function (c) {
          var chipTags = (c.dataset.tags || '').split(' ');
          c.style.display = (f === 'todos' || chipTags.indexOf(f) !== -1) ? '' : 'none';
        });
        var panel = document.getElementById('tab-' + tabId);
        if (panel) {
          panel.querySelectorAll('.sabores-grupo').forEach(function (g) {
            var anyVis = Array.prototype.some.call(g.querySelectorAll('.sabor-chip'), function (c) {
              return f === 'todos' || (c.dataset.tags || '').split(' ').indexOf(f) !== -1;
            });
            g.style.display = anyVis ? '' : 'none';
          });
        }
      });
      return b;
    }

    bar.appendChild(makeFilterBtn('todos', 'Todos'));
    relevantes.forEach(function (t) { bar.appendChild(makeFilterBtn(t, TAG_LABELS[t])); });

    var firstGrupo = contenido.querySelector('.sabores-grupo');
    if (firstGrupo) contenido.insertBefore(bar, firstGrupo);
  }

  function buildPanel(cat, productosMapa) {
    var panel = document.createElement('div');
    panel.className = 'tab-panel';
    panel.id = 'tab-' + cat.id;
    panel.setAttribute('role', 'tabpanel');

    var bloque = document.createElement('div');
    bloque.className = 'categoria-bloque';
    bloque.id = cat.id;

    // Category image
    var imgDiv = document.createElement('div');
    imgDiv.className = 'categoria-imagen';
    if (cat.imagenCategoria) {
      imgDiv.innerHTML = '<img src="' + cat.imagenCategoria + '" alt="' + cat.tituloCompleto + ' Mepiache">';
    } else {
      imgDiv.innerHTML = '<div class="img-placeholder" style="height:320px;aspect-ratio:auto;">' +
        '<span>' + cat.emoji + '</span><p>Imagen ' + cat.nombre.toLowerCase() + '</p></div>';
    }

    // Content column
    var contenido = document.createElement('div');
    contenido.className = 'categoria-contenido';
    contenido.innerHTML = '<h3>' + cat.tituloCompleto + '</h3><p>' + cat.descripcionCategoria + '</p>';

    // Product groups
    (cat.grupos || []).forEach(function (grupo) {
      var visibles = (grupo.productos || []).filter(function (id) {
        var p = productosMapa[id];
        return p && p.visible !== false;
      });
      if (!visibles.length) return;

      var grupoDiv = document.createElement('div');
      grupoDiv.className = 'sabores-grupo';
      grupoDiv.innerHTML = '<span class="sabores-grupo-titulo">' + grupo.titulo + '</span>';

      var chipsDiv = document.createElement('div');
      chipsDiv.className = 'sabores-chips';

      visibles.forEach(function (id) {
        var prod = productosMapa[id];
        var tags = getTags(prod.filtros);
        var extraClass = prod.filtros.vegano ? ' vegano' : (prod.filtros.premium ? ' premium' : '');
        var icons = buildChipIcons(tags);

        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'sabor-chip' + extraClass;
        btn.dataset.sabor = id;
        btn.dataset.tab   = cat.id;
        btn.dataset.tags  = tags.join(' ');
        btn.innerHTML = icons + prod.nombre;
        chipsDiv.appendChild(btn);
      });

      grupoDiv.appendChild(chipsDiv);
      contenido.appendChild(grupoDiv);
    });

    // Optional availability note
    if (cat.notaAviso) {
      var nota = document.createElement('p');
      nota.style.cssText = 'font-family:Arial,sans-serif;font-size:13px;color:var(--gris-suave);margin-top:8px;';
      nota.textContent = cat.notaAviso;
      contenido.appendChild(nota);
    }

    // Price block (sustancias)
    if (cat.mostrarPrecio) {
      var M = window.MEPIACHE || {};
      var precio = M.precioSustancia || '$5.000 CLP';
      var precioDiv = document.createElement('div');
      precioDiv.style.cssText = 'background:var(--crema-suave);border-radius:10px;padding:16px 20px;margin:20px 0;border-left:3px solid var(--dorado);';
      precioDiv.innerHTML = '<p style="font-family:Arial,sans-serif;font-size:14px;color:var(--gris-texto);margin:0;">' +
        '<strong style="color:var(--cafe);">' + precio + '</strong> · Temporada invierno</p>';
      contenido.appendChild(precioDiv);
    }

    // Detail panel placeholder
    contenido.insertAdjacentHTML('beforeend', buildDetallePanel(cat.id));

    // CTA button
    var waNum  = (window.MEPIACHE && MEPIACHE.wa) ? MEPIACHE.wa : '56963914909';
    var waHref = 'https://wa.me/' + waNum + '?text=' + encodeURIComponent(cat.ctaWA);
    var ctaDiv = document.createElement('div');
    ctaDiv.className = 'categoria-cta';
    ctaDiv.innerHTML = '<a href="' + waHref + '" target="_blank" class="btn-wa">' + WA_SVG + ' ' + cat.ctaLabel + '</a>';
    contenido.appendChild(ctaDiv);

    bloque.appendChild(imgDiv);
    bloque.appendChild(contenido);
    panel.appendChild(bloque);
    return panel;
  }

  function initEvents(tabsNav, panelsContainer, productosMapa, tabDefaultImgs) {
    // Tab switching
    tabsNav.querySelectorAll('.tab-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        tabsNav.querySelectorAll('.tab-btn').forEach(function (b) { b.classList.remove('activo'); });
        panelsContainer.querySelectorAll('.tab-panel').forEach(function (p) { p.classList.remove('activo'); });
        this.classList.add('activo');
        var targetPanel = document.getElementById('tab-' + this.dataset.tab);
        if (targetPanel) targetPanel.classList.add('activo');
        panelsContainer.querySelectorAll('.sabor-detalle').forEach(function (d) {
          d.hidden = true; d.dataset.current = '';
        });
        panelsContainer.querySelectorAll('.sabor-chip').forEach(function (c) { c.classList.remove('activo'); });
        Object.keys(tabDefaultImgs).forEach(function (tid) { restaurarImagen(tid); });
      });
    });

    // Chip click
    panelsContainer.addEventListener('click', function (e) {
      var btn = e.target.closest('.sabor-chip');
      if (!btn) return;

      var id    = btn.dataset.sabor;
      var tabId = btn.dataset.tab;
      var prod  = productosMapa[id];
      var detalleEl = document.getElementById('detalle-' + tabId);
      if (!prod || !detalleEl) return;

      var mismaSabor = !detalleEl.hidden && detalleEl.dataset.current === id;

      panelsContainer.querySelectorAll('.sabor-chip[data-tab="' + tabId + '"]').forEach(function (c) {
        c.classList.remove('activo');
      });

      if (mismaSabor) {
        detalleEl.hidden = true;
        detalleEl.dataset.current = '';
        restaurarImagen(tabId);
        return;
      }

      llenarPanel(detalleEl, prod, tabId);
      var details = detalleEl.querySelector('details');
      if (details) details.removeAttribute('open');

      detalleEl.hidden = false;
      detalleEl.dataset.current = id;
      btn.classList.add('activo');
      cambiarImagen(tabId, prod, tabDefaultImgs);
      detalleEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    // Close button
    panelsContainer.addEventListener('click', function (e) {
      var closeBtn = e.target.closest('.sabor-detalle-cerrar');
      if (!closeBtn) return;
      var detalleEl = closeBtn.closest('.sabor-detalle');
      if (!detalleEl) return;
      var tabId = detalleEl.id.replace('detalle-', '');
      detalleEl.hidden = true;
      detalleEl.dataset.current = '';
      panelsContainer.querySelectorAll('.sabor-chip').forEach(function (c) { c.classList.remove('activo'); });
      restaurarImagen(tabId, tabDefaultImgs);
    });
  }

  // ── Main entry ──────────────────────────────────────────────────────
  function iniciar(data) {
      var tabsNav        = document.getElementById('tabs-nav-container');
      var panelsContainer = document.getElementById('tabs-panels-container');
      if (!tabsNav || !panelsContainer) return;

      // Build products map from embedded structure
      var productosMapa = {};
      (data.categorias || []).forEach(function (cat) {
        (cat.grupos || []).forEach(function (grupo) {
          (grupo.productos || []).forEach(function (p) {
            if (p.id) {
              p._id = p.id;
              productosMapa[p.id] = p;
            }
          });
        });
      });

      // Apply saboresOcultos from config
      var ocultos = (window.MEPIACHE && MEPIACHE.saboresOcultos) || [];
      ocultos.forEach(function (id) {
        if (productosMapa[id]) productosMapa[id].visible = false;
      });

      var tabDefaultImgs = {};
      var visibleCats = (data.categorias || []).filter(function (c) { return c.visible !== false; });

      // Build tabs nav
      visibleCats.forEach(function (cat, i) {
        var btn = document.createElement('button');
        btn.className = 'tab-btn' + (i === 0 ? ' activo' : '');
        btn.dataset.tab = cat.id;
        btn.setAttribute('role', 'tab');
        btn.innerHTML =
          '<span class="tab-icono">' + cat.emoji + '</span>' +
          '<span class="tab-nombre">' + cat.nombre + '</span>' +
          '<span class="tab-desc-corta">' + cat.subtitulo + '</span>';
        tabsNav.appendChild(btn);
        tabDefaultImgs[cat.id] = cat.imagenCategoria || null;
      });

      // Build panels
      visibleCats.forEach(function (cat, i) {
        var panel = buildPanel(cat, productosMapa);
        if (i === 0) panel.classList.add('activo');
        panelsContainer.appendChild(panel);
      });

      // Build filter bars
      visibleCats.forEach(function (cat) {
        var panelEl  = document.getElementById('tab-' + cat.id);
        if (!panelEl) return;
        var contenido = panelEl.querySelector('.categoria-contenido');
        if (!contenido) return;
        var chips = Array.prototype.slice.call(panelEl.querySelectorAll('.sabor-chip'));
        buildFilterBar(cat.id, chips, contenido);
      });

      // Handle hash navigation
      var hash      = window.location.hash.replace('#', '');
      var validTabs = visibleCats.map(function (c) { return c.id; });
      if (hash && validTabs.indexOf(hash) !== -1) {
        tabsNav.querySelectorAll('.tab-btn').forEach(function (b) { b.classList.remove('activo'); });
        panelsContainer.querySelectorAll('.tab-panel').forEach(function (p) { p.classList.remove('activo'); });
        var hBtn   = tabsNav.querySelector('[data-tab="' + hash + '"]');
        var hPanel = document.getElementById('tab-' + hash);
        if (hBtn)   hBtn.classList.add('activo');
        if (hPanel) hPanel.classList.add('activo');
      }

      // Wire up events
      initEvents(tabsNav, panelsContainer, productosMapa, tabDefaultImgs);
  }

  if (window.PRODUCTOS_DATA) {
    iniciar(window.PRODUCTOS_DATA);
  } else {
    var c = document.getElementById('tabs-panels-container');
    if (c) c.innerHTML = '<p style="padding:24px;color:var(--gris-texto);">No se pudieron cargar los productos. Intenta recargar la página.</p>';
  }

})();
