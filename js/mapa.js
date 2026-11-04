(function () {
  'use strict';
  const datos = window.PORTEÑA_MAPA;
  const L = window.L;
  const respaldo = document.querySelector('#mapa-recorrido') ||
    document.querySelector('iframe[title="Mapa general de Buenos Aires"]');
  if (!datos || !L || !respaldo) return;
  const script = document.currentScript || document.querySelector('script[src$="js/mapa.js"]');
  const raiz = new URL('../', script.src);
  const simbolo = svg => {
    const plantilla = document.createElement('template');
    plantilla.innerHTML = svg;
    return plantilla.content.firstElementChild;
  };
  const contenedor = document.createElement('section');
  contenedor.className = 'mapa-vista no-imprimir';
  contenedor.setAttribute('aria-label', 'Mapa interactivo de los recorridos');
  contenedor.innerHTML =
    '<div class="mapa-controles">' +
      '<div>' +
        '<label for="tema-mapa">Filtrar puntos por temática</label>' +
        '<select id="tema-mapa"><option value="todos">Todos los puntos</option></select>' +
      '</div>' +
      '<button type="button" id="restablecer-mapa">Ver todos los puntos</button>' +
    '</div>' +
    '<div id="mapa-geografico" class="mapa-geografico" role="region" ' +
      'aria-label="Mapa con marcadores numerados. Usá el listado de paradas como alternativa de navegación."></div>' +
    '<ul class="mapa-leyenda" aria-label="Temáticas del mapa"></ul>' +
    '<p id="estado-base-mapa" class="ayuda" role="status"></p>' +
    '<p class="ayuda">Los números indican el orden de la guía. ' +
      'Consultá los itinerarios para organizar los traslados. Cartografía: OpenStreetMap. Datos geográficos: USIG.</p>';
  respaldo.before(contenedor);
  contenedor.append(respaldo);
  const seleccion = document.getElementById('tema-mapa');
  const elemento = document.getElementById('mapa-geografico');
  let estado = document.getElementById('estado-mapa');
  if (!estado) {
    estado = document.createElement('p');
    estado.id = 'estado-mapa';
    estado.className = 'ayuda';
    estado.setAttribute('role','status');
    contenedor.append(estado);
  }
  const leyenda = contenedor.querySelector('.mapa-leyenda');
  datos.recorridos.forEach(r => {
    const opcion = document.createElement('option');
    opcion.value = r.id;
    opcion.textContent = r.nombre;
    seleccion.append(opcion);
    const li = document.createElement('li');
    const muestra = document.createElement('span');
    muestra.style.backgroundColor = r.color;
    muestra.setAttribute('aria-hidden','true');
    li.append(muestra, document.createTextNode(r.nombre));
    leyenda.append(li);
  });
  const mapa = L.map(elemento, { scrollWheelZoom: false, keyboard: true }).setView([-34.609, -58.4], 12);
  const fondo = L.tileLayer(datos.teselas, {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(mapa);
  const ayudaFondo = location.protocol === 'file:'
    ? ' Abierto como archivo, OpenStreetMap rechaza el fondo: ' +
      'usá npm start y abrí http://localhost:8000, o la versión publicada.'
    : '';
  fondo.on('tileerror', function () {
    document.getElementById('estado-base-mapa').textContent = 'No se pudo cargar parte del fondo cartográfico.' +
      ayudaFondo + ' Los marcadores, las direcciones y los enlaces externos siguen disponibles.';
  });
  const capa = L.layerGroup().addTo(mapa);
  const marcadores = new Map();
  const puntos = datos.recorridos.flatMap(r =>
    r.puntos.map(p => ({ ...p, tema: r.id, tematica: r.nombre, color: r.color })));
  function mostrar(tema) {
    capa.clearLayers(); marcadores.clear();
    elemento.hidden = false; respaldo.hidden = true;
    const visibles = puntos.filter(p => p.posicion && (tema === 'todos' || p.tema === tema));
    const grupos = new Map();
    visibles.forEach(p => {
      const clave = p.posicion.lat + ',' + p.posicion.lon;
      if (!grupos.has(clave)) grupos.set(clave, []);
      grupos.get(clave).push(p);
    });
    grupos.forEach(grupo => {
      const p = grupo[0];
      const numeros = grupo.map(o => String(o.numero).padStart(2,'0')).join('·');
      const icono = document.createElement('span');
      icono.className = 'mapa-numero';
      icono.style.backgroundColor = p.color;
      icono.textContent = numeros;
      const marcador = L.marker([p.posicion.lat,p.posicion.lon], {
        icon: L.divIcon({ className: 'mapa-marcador', html: icono, iconSize: [38,38], iconAnchor: [19,19] }),
        title: grupo.map(o => o.tematica + ': ' + o.numero + '. ' + o.nombre).join('; '),
        keyboard: true
      });
      const contenido = document.createElement('div');
      grupo.forEach(o => {
        const titulo = document.createElement('strong');
        titulo.textContent = o.tematica + ' · ' + o.numero + '. ' + o.nombre;
        const direccion = document.createElement('p');
        direccion.textContent = o.direccion;
        const a = document.createElement('a');
        a.href = new URL('pantallas/puntos/' + o.id + '.html',raiz).href;
        a.textContent = 'Ver ficha de ' + o.nombre + ' ';
        a.append(simbolo(datos.flecha));
        contenido.append(titulo,direccion,a);
        marcadores.set(o.id,marcador);
      });
      marcador.bindPopup(contenido).addTo(capa);
    });
    if (visibles.length) {
      mapa.fitBounds(visibles.map(p => [p.posicion.lat,p.posicion.lon]), { padding: [35,35], maxZoom: 15 });
    }
    estado.textContent = visibles.length + ' fichas ubicadas en el mapa. ' +
      'Elegí un marcador o una parada del listado para conocer el lugar.';
    mapa.invalidateSize();
  }
  seleccion.addEventListener('change', function () { mostrar(seleccion.value); });
  document.getElementById('restablecer-mapa').addEventListener('click', function () {
    seleccion.value = 'todos';
    mostrar('todos');
  });
  document.querySelectorAll('[data-mapa]').forEach(enlace => {
    const ficha = enlace.closest('li').querySelector('a[href*="/puntos/"]');
    const coincidencia = ficha && ficha.getAttribute('href').match(/\/puntos\/([^/]+)\.html/);
    const punto = coincidencia && puntos.find(p => p.id === coincidencia[1]);
    enlace.addEventListener('click', function (evento) {
      if (!punto || !punto.posicion) {
        elemento.hidden = true; respaldo.hidden = false;
        return;
      }
      evento.preventDefault();
      seleccion.value = punto.tema; mostrar(punto.tema);
      mapa.setView([punto.posicion.lat,punto.posicion.lon],16);
      marcadores.get(punto.id).openPopup();
      estado.textContent = 'Seleccionado: ' + punto.nombre + '. ' + punto.direccion;
    });
  });
  mostrar('todos');
})();
