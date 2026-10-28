/* Actividad 3. DOM, variables, funciones, operadores y eventos (hasta el 25/10).
   No se utilizan fetch, JSON, frameworks frontend ni almacenamiento de datos. */

const botonMenu = document.querySelector('#boton-menu');
const menu = document.querySelector('#menu');
if (botonMenu && menu) {
  botonMenu.hidden = false;
  menu.hidden = true;
  botonMenu.addEventListener('click', function () {
    menu.hidden = !menu.hidden;
    botonMenu.setAttribute('aria-expanded', String(!menu.hidden));
  });
  document.addEventListener('keydown', function (evento) {
    if (evento.key === 'Escape' && !menu.hidden) {
      menu.hidden = true;
      botonMenu.setAttribute('aria-expanded', 'false');
      botonMenu.focus();
    }
  });
}

const botonesJS = document.querySelectorAll('[data-requiere-js]');
for (let i = 0; i < botonesJS.length; i++) botonesJS[i].disabled = false;

/* El navegador verifica required, type, min, max, step y minlength antes
   de disparar submit. La confirmación es una simulación explícita. */
const contacto = document.querySelector('#formulario-contacto');
if (contacto) {
  const estado = document.querySelector('#estado-contacto');
  contacto.addEventListener('submit', function (evento) {
    evento.preventDefault();
    estado.textContent = 'Consulta validada, ' + contacto.elements.nombre.value.trim() + '. Esta es una simulación: el mensaje no se envió ni se guardó.';
    estado.hidden = false;
    estado.focus();
    contacto.reset();
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
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  fecha.min = hoy.getFullYear() + '-' + mes + '-' + dia;

  function pesos(valor) { return 'ARS $ ' + valor.toLocaleString('es-AR'); }

  function calcular() {
    const unitario = Number(recorrido.value);
    const personas = Number(cantidad.value);
    let extra = 0;
    if (adicional.checked) extra = 3000;
    precio.textContent = unitario > 0 ? pesos(unitario) : 'Elegí un recorrido';
    costoAdicional.textContent = pesos(extra) + ' por persona';
    if (unitario === 0 || !Number.isInteger(personas) || personas < 1 || personas > 20) {
      importe.textContent = 'Completá tu selección';
      return null;
    }
    const total = (unitario + extra) * personas;
    importe.textContent = pesos(total);
    return total;
  }

  function invalidarResumen() {
    resumen.hidden = true;
    resultado.hidden = true;
    calcular();
  }
  reserva.addEventListener('input', invalidarResumen);
  reserva.addEventListener('change', invalidarResumen);
  reserva.addEventListener('reset', function () {
    resumen.hidden = true;
    resultado.hidden = true;
    /* reset termina después del evento: se restaura el cálculo en el próximo turno. */
    setTimeout(calcular, 0);
  });
  reserva.addEventListener('submit', function (evento) {
    evento.preventDefault();
    const total = calcular();
    if (total === null) return;
    const opcion = recorrido.options[recorrido.selectedIndex];
    document.querySelector('#resumen-recorrido').textContent = opcion.dataset.nombre;
    document.querySelector('#resumen-personas').textContent = cantidad.value;
    document.querySelector('#resumen-fecha').textContent = fecha.value.split('-').reverse().join('/');
    document.querySelector('#resumen-adicional').textContent = adicional.checked ? 'Guía impresa: ARS $ 3.000 por persona' : 'Sin adicionales';
    document.querySelector('#resumen-total').textContent = pesos(total);
    resumen.hidden = false;
    resultado.hidden = true;
    confirmar.focus();
  });
  document.querySelector('#editar-reserva').addEventListener('click', function () {
    resumen.hidden = true;
    recorrido.focus();
  });
  confirmar.addEventListener('click', function () {
    resumen.hidden = true;
    resultado.textContent = 'Solicitud simulada confirmada. Total: ' + importe.textContent + '. No se realizó una reserva real, no se enviaron datos y no se efectuaron cobros.';
    resultado.hidden = false;
    resultado.focus();
  });
  calcular();
}

/* Preguntas frecuentes: búsqueda local sobre el contenido visible del HTML. */
const buscadorFAQ = document.querySelector('#buscar-preguntas');
if (buscadorFAQ) {
  const preguntas = document.querySelectorAll('#preguntas details');
  buscadorFAQ.addEventListener('input', function () {
    const busqueda = buscadorFAQ.value.toLocaleLowerCase('es').trim();
    let coincidencias = 0;
    for (let i = 0; i < preguntas.length; i++) {
      const coincide = preguntas[i].textContent.toLocaleLowerCase('es').includes(busqueda);
      preguntas[i].hidden = !coincide;
      if (coincide) coincidencias++;
    }
    document.querySelector('#estado-preguntas').textContent = coincidencias === 0
      ? 'No encontramos esa consulta. Podés escribirnos desde Contacto.'
      : coincidencias + ' preguntas disponibles.';
  });
}

/* El mapa usa enlaces dirigidos al iframe: funciona también sin JavaScript. */
const enlacesMapa = document.querySelectorAll('[data-mapa]');
for (let i = 0; i < enlacesMapa.length; i++) {
  enlacesMapa[i].addEventListener('click', function () {
    for (let j = 0; j < enlacesMapa.length; j++) enlacesMapa[j].removeAttribute('aria-current');
    enlacesMapa[i].setAttribute('aria-current', 'location');
    document.querySelector('#estado-mapa').textContent = 'Ubicación seleccionada: ' + enlacesMapa[i].textContent.trim() + '. También podés abrirla en el enlace externo.';
  });
}

const botonImprimir = document.querySelector('#imprimir');
if (botonImprimir) {
  botonImprimir.hidden = false;
  botonImprimir.addEventListener('click', function () { window.print(); });
}
