/* Porteña · HTML5, Tailwind CSS y JavaScript sin frameworks.
   Los formularios son simulaciones: no transmiten ni almacenan datos. */
'use strict';

const botonMenu = document.querySelector('#boton-menu');
const menu = document.querySelector('#menu');
if (botonMenu && menu) {
  botonMenu.hidden = false;
  menu.hidden = true;
  botonMenu.setAttribute('aria-expanded', 'false');
  function cerrarMenu() { menu.hidden = true; botonMenu.setAttribute('aria-expanded', 'false'); }
  botonMenu.addEventListener('click', function () {
    menu.hidden = !menu.hidden;
    botonMenu.setAttribute('aria-expanded', String(!menu.hidden));
  });
  document.addEventListener('keydown', function (evento) {
    if (evento.key === 'Escape' && !menu.hidden) { cerrarMenu(); botonMenu.focus(); }
  });
  menu.addEventListener('click', function (evento) { if (evento.target.closest('a')) cerrarMenu(); });
}
document.querySelectorAll('[data-requiere-js]').forEach(boton => { boton.disabled = false; });

/* HTML conserva required/type/min/max. JS añade errores asociados a cada campo,
   valida el texto sin espacios y dirige el foco al primer error. */
function prepararValidacion(formulario) {
  formulario.noValidate = true;
  const campos = Array.from(formulario.querySelectorAll('input:not([type="checkbox"]), select, textarea'));
  campos.forEach(campo => {
    const error = document.createElement('p');
    error.id = 'error-' + campo.id;
    error.className = 'error-campo';
    error.hidden = true;
    campo.insertAdjacentElement('afterend', error);
    const ayuda = campo.getAttribute('aria-describedby') || '';
    campo.setAttribute('aria-describedby', (ayuda + ' ' + error.id).trim());
    campo.addEventListener('input', function () {
      if (campo.getAttribute('aria-invalid') === 'true') validarCampo(campo);
    });
  });
  function validarCampo(campo) {
    campo.setCustomValidity('');
    const texto = campo.value.trim();
    let mensaje = '';
    if (campo.required && !texto) mensaje = 'Completá este campo.';
    else if (campo.name === 'nombre' && texto.length < 2) mensaje = 'Escribí un nombre de al menos 2 caracteres, sin contar espacios al inicio o al final.';
    else if (campo.name === 'mensaje' && texto.length < 10) mensaje = 'Escribí un mensaje de al menos 10 caracteres, sin contar espacios al inicio o al final.';
    else if (campo.validity.typeMismatch) mensaje = 'Escribí un correo válido, por ejemplo nombre@ejemplo.com.';
    else if (campo.name === 'personas' && (!Number.isInteger(Number(texto)) || Number(texto) < 1 || Number(texto) > 20)) mensaje = 'Ingresá un número entero de 1 a 20 personas.';
    else if (campo.name === 'fecha' && (campo.validity.rangeUnderflow || campo.value < campo.min)) mensaje = 'Elegí hoy o una fecha posterior.';
    else if (!campo.validity.valid) mensaje = 'Revisá el valor de este campo y respetá las indicaciones.';
    campo.setCustomValidity(mensaje);
    const error = document.getElementById('error-' + campo.id);
    error.textContent = mensaje ? 'Error: ' + mensaje : '';
    error.hidden = !mensaje;
    if (mensaje) campo.setAttribute('aria-invalid', 'true');
    else campo.removeAttribute('aria-invalid');
    return !mensaje;
  }
  formulario.addEventListener('reset', function () {
    campos.forEach(campo => {
      campo.setCustomValidity('');
      campo.removeAttribute('aria-invalid');
      document.getElementById('error-' + campo.id).hidden = true;
    });
  });
  return function () {
    let primero = null;
    campos.forEach(campo => { if (!validarCampo(campo) && !primero) primero = campo; });
    if (primero) primero.focus();
    return !primero;
  };
}

const contacto = document.querySelector('#formulario-contacto');
if (contacto) {
  const estado = document.querySelector('#estado-contacto');
  const validar = prepararValidacion(contacto);
  contacto.addEventListener('submit', function (evento) {
    evento.preventDefault();
    estado.hidden = true;
    if (!validar()) return;
    estado.textContent = 'Consulta validada, ' + contacto.elements.nombre.value.trim() + '. Esta es una simulación: el mensaje no se envió ni se guardó.';
    contacto.reset();
    estado.hidden = false;
    estado.focus();
  });
  contacto.addEventListener('input', function () { estado.hidden = true; });
}

const reserva = document.querySelector('#formulario-reserva');
if (reserva) {
  const recorrido = document.querySelector('#recorrido');
  const cantidad = document.querySelector('#personas');
  const adicional = document.querySelector('#adicional');
  const precio = document.querySelector('#precio-unitario');
  const costoAdicional = document.querySelector('#costo-adicional');
  const importe = document.querySelector('#importe-total');
  const resumen = document.querySelector('#resumen-reserva');
  const resultado = document.querySelector('#estado-reserva');
  const confirmar = document.querySelector('#confirmar-reserva');
  const fecha = document.querySelector('#fecha');
  const validar = prepararValidacion(reserva);
  const tarifas = { futbol: 12000, arquitectura: 10000, gastronomia: 15000, 'arte-urbano': 9000, cine: 11000 };
  let totalRevisado = null;
  // La fecha mínima usa Buenos Aires aunque el dispositivo esté en otro huso.
  function actualizarFechaMinima() {
    const partes = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Argentina/Buenos_Aires', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
    const parte = tipo => partes.find(p => p.type === tipo).value;
    fecha.min = parte('year') + '-' + parte('month') + '-' + parte('day');
  }
  actualizarFechaMinima();
  const parametros = new URLSearchParams(window.location.search);
  const opcionInicial = parametros.get('recorrido');
  if (Object.hasOwn(tarifas, opcionInicial)) recorrido.value = String(tarifas[opcionInicial]);
  const personasIniciales = Number(parametros.get('personas'));
  if (Number.isInteger(personasIniciales) && personasIniciales >= 1 && personasIniciales <= 20) cantidad.value = String(personasIniciales);
  if (parametros.get('guia') === 'si') adicional.checked = true;
  function pesos(valor) { return 'ARS $ ' + valor.toLocaleString('es-AR'); }
  function calcular() {
    const unitario = Number(recorrido.value);
    const personas = Number(cantidad.value);
    const extra = adicional.checked ? 3000 : 0;
    const tarifaValida = Object.values(tarifas).includes(unitario);
    precio.textContent = tarifaValida ? pesos(unitario) : 'Elegí un recorrido';
    costoAdicional.textContent = pesos(extra) + ' por persona';
    if (!tarifaValida || !Number.isInteger(personas) || personas < 1 || personas > 20) {
      importe.textContent = 'Completá tu selección';
      return null;
    }
    const total = (unitario + extra) * personas;
    importe.textContent = pesos(total);
    return total;
  }
  function invalidarResumen() { resumen.hidden = true; resultado.hidden = true; totalRevisado = null; calcular(); }
  reserva.addEventListener('input', invalidarResumen);
  reserva.addEventListener('change', invalidarResumen);
  reserva.addEventListener('reset', function () { invalidarResumen(); setTimeout(calcular, 0); });
  reserva.addEventListener('submit', function (evento) {
    evento.preventDefault();
    actualizarFechaMinima();
    if (!validar()) return;
    const total = calcular();
    if (total === null) return;
    totalRevisado = total;
    document.querySelector('#resumen-recorrido').textContent = recorrido.options[recorrido.selectedIndex].dataset.nombre;
    document.querySelector('#resumen-personas').textContent = cantidad.value;
    document.querySelector('#resumen-fecha').textContent = fecha.value.split('-').reverse().join('/');
    document.querySelector('#resumen-adicional').textContent = adicional.checked ? 'Guía impresa: ARS $ 3.000 por persona' : 'Sin adicionales';
    document.querySelector('#resumen-total').textContent = pesos(total);
    resumen.hidden = false;
    resultado.hidden = true;
    confirmar.focus();
  });
  document.querySelector('#editar-reserva').addEventListener('click', function () { invalidarResumen(); recorrido.focus(); });
  confirmar.addEventListener('click', function () {
    if (resumen.hidden || totalRevisado === null) return;
    actualizarFechaMinima();
    if (!validar() || calcular() !== totalRevisado) { invalidarResumen(); return; }
    const total = totalRevisado;
    totalRevisado = null;
    resumen.hidden = true;
    resultado.textContent = 'Solicitud simulada confirmada. Total: ' + pesos(total) + '. No se realizó una reserva real, no se enviaron datos y no se efectuaron cobros.';
    resultado.hidden = false;
    resultado.focus();
  });
  calcular();
}

const buscadorFAQ = document.querySelector('#buscar-preguntas');
if (buscadorFAQ) {
  const preguntas = document.querySelectorAll('#preguntas details');
  const normalizar = texto => texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es').trim();
  buscadorFAQ.addEventListener('input', function () {
    const busqueda = normalizar(buscadorFAQ.value);
    let coincidencias = 0;
    preguntas.forEach(pregunta => {
      const coincide = normalizar(pregunta.textContent).includes(busqueda);
      pregunta.hidden = !coincide;
      if (!coincide) pregunta.open = false;
      if (coincide) coincidencias++;
    });
    document.querySelector('#estado-preguntas').textContent = coincidencias === 0
      ? 'No encontramos esa consulta. Podés escribirnos desde Contacto.' : coincidencias + ' preguntas disponibles.';
  });
}

const enlacesMapa = document.querySelectorAll('[data-mapa]');
enlacesMapa.forEach(enlace => {
  enlace.addEventListener('click', function () {
    enlacesMapa.forEach(otro => otro.removeAttribute('aria-current'));
    enlace.setAttribute('aria-current', 'location');
    document.querySelector('#estado-mapa').textContent = 'Ubicación seleccionada: ' + enlace.textContent.trim() + '. Si no se muestra, usá el enlace Abrir mapa de esa parada.';
  });
});

const botonImprimir = document.querySelector('#imprimir');
if (botonImprimir) {
  botonImprimir.hidden = false;
  let abiertos = [];
  window.addEventListener('beforeprint', function () {
    abiertos = Array.from(document.querySelectorAll('details')).map(detalle => detalle.open);
    document.querySelectorAll('details').forEach(detalle => { detalle.open = true; });
  });
  window.addEventListener('afterprint', function () {
    document.querySelectorAll('details').forEach((detalle, i) => { detalle.open = abiertos[i] || false; });
  });
  botonImprimir.addEventListener('click', function () { window.print(); });
}
