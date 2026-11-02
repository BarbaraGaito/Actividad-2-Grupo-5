/* Chat de preguntas frecuentes de Porteña.
   Responde con reglas y contenido del proyecto. No usa IA generativa, servicios
   externos ni almacenamiento. Solo consulta la información incluida en el sitio. */
(function () {
  'use strict';
  const datos = window.PORTEÑA_AYUDA;
  if (!datos) return;
  const script = document.currentScript || document.querySelector('script[src$="js/chat.js"]');
  const raiz = new URL('../', script.src);
  const normalizar = texto => texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  const pesos = valor => 'ARS $ ' + valor.toLocaleString('es-AR');
  const url = ruta => new URL(ruta, raiz).href;
  const enlace = (texto, ruta) => ({ texto, href: url(ruta) });
  const faq = enlace('Ver todas las preguntas frecuentes', 'pantallas/preguntas-frecuentes/index.html');
  const contacto = enlace('Ir al formulario de contacto', 'pantallas/contacto/index.html');
  const mapa = enlace('Explorar el mapa y sus referencias', 'pantallas/mapa/index.html');
  const sinTildes = datos.recorridos.map(r => ({ recorrido: r, nombre: normalizar(r.nombre) }));
  const palabrasVacias = new Set(['como','cual','cuales','donde','esta','estan','para','puedo','quiero','saber','sobre','tengo','tiene','las','los','una','por','del','que','hay','con','mas','son','como','cuanto','cuantos']);
  function responder(texto) {
    const consulta = normalizar(texto);
    const tema = sinTildes.find(r => consulta.includes(r.nombre));
    const recorrido = tema && tema.recorrido;
    if (/^(hola|buenas|buen dia|buenos dias|buenas tardes|buenas noches|ayuda|gracias)$/.test(consulta)) {
      return { texto: '¡Hola! Soy el asistente de Porteña. Puedo ayudarte con los cinco recorridos, las obras de arte urbano, ubicaciones, precios y reservas. ¿Qué te gustaría conocer?', enlaces: [faq] };
    }
    if (/dolar|usd|euro|moneda|cambio|conversion/.test(consulta)) {
      return { texto: 'Los precios de la planificación están expresados en pesos argentinos (ARS). No se usa moneda extranjera ni se aplica un tipo de cambio. Las guías y las fotografías se pueden consultar gratis.', enlaces: [enlace('Ver precios y planificar', 'pantallas/reserva/index.html')] };
    }
    if (/gratis|gratuit|sin costo|por mi cuenta/.test(consulta)) return { texto: 'Consultar las guías, las fotografías y el mapa de Porteña es gratuito. Podés explorar por tu cuenta. La planificación con precios es una simulación académica de acompañamiento; no incluye entradas, traslados ni consumos.', enlaces: [enlace('Explorar los recorridos', 'index.html#recorridos')] };
    if (/precio|cuesta|cuestan|costo|costos|cuanto (sale|pago)|tarifa|presupuesto/.test(consulta)) {
      if (!recorrido) return { texto: 'Precios de la planificación simulada por persona: ' + datos.recorridos.map(r => r.nombre + ': ' + pesos(r.precio)).join('; ') + '. La guía impresa opcional agrega ' + pesos(datos.adicional) + ' por persona. Indicame la temática y la cantidad para calcular tu total. No incluye entradas, traslados ni consumos.', enlaces: [enlace('Preparar una solicitud', 'pantallas/reserva/index.html')] };
      const palabrasCantidad = { una: 1, uno: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5, seis: 6, siete: 7, ocho: 8, nueve: 9, diez: 10, veinte: 20 };
      const numero = consulta.match(/(?:para|somos)\s+(\d+|una|uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|veinte)\b/) || consulta.match(/(\d+|una|uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|veinte)\s+(?:personas?|adultos?|visitantes?)\b/);
      const cifraOriginal = texto.match(/(?:para|somos)\s+(-?\d+(?:[.,]\d+)?)/i) || texto.match(/(-?\d+(?:[.,]\d+)?)\s+(?:personas?|adultos?|visitantes?)/i);
      const cantidad = cifraOriginal ? Number(cifraOriginal[1].replace(',', '.')) : numero ? (palabrasCantidad[numero[1]] || Number(numero[1])) : 1;
      if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > 20) return { texto: 'La planificación admite de 1 a 20 personas. Indicá una cantidad dentro de ese rango para calcular el importe.', enlaces: [contacto] };
      const extra = /guia impresa|con guia|adicional/.test(consulta) && !/sin guia|sin adicional/.test(consulta) ? datos.adicional : 0;
      return { texto: recorrido.nombre + ': ' + pesos(recorrido.precio) + ' por persona. ' + (extra ? 'Guía impresa: ' + pesos(extra) + ' por persona. ' : 'Sin guía impresa adicional. ') + 'Para ' + cantidad + (cantidad === 1 ? ' persona' : ' personas') + ', total: ' + pesos((recorrido.precio + extra) * cantidad) + '. Es una solicitud simulada; no se realizan cobros ni reservas reales. Entradas, traslados y consumos no incluidos.', enlaces: [enlace('Revisar y preparar esta experiencia', 'pantallas/reserva/index.html?recorrido=' + recorrido.id + '&personas=' + cantidad + (extra ? '&guia=si' : ''))] };
    }
    if (/datos|privacidad|almacena|guardan|guardar|historial/.test(consulta)) return { texto: 'El contacto y la reserva no envían ni guardan datos. Esta conversación se mantiene solo mientras estás en la página y podés borrarla con Limpiar conversación. Los mapas sí conectan con Google al cargarse.', enlaces: [faq] };
    if (/contacto|correo|mensaje|escribir|escribo|comunicar/.test(consulta)) return { texto: 'En Contacto podés completar nombre, correo electrónico, motivo y mensaje. Se validan los campos y se muestra una confirmación. El envío es simulado: la consulta no se transmite ni se guarda.', enlaces: [contacto] };
    if (/silla|ruedas|accesib|discapacidad|movilidad|teclado/.test(consulta)) return { texto: 'El sitio ofrece navegación por teclado, foco visible y etiquetas en los formularios. En los recorridos puede haber escalones, adoquines o accesos que cambian según el espacio. Consultá las condiciones de accesibilidad física con cada establecimiento antes de salir.', enlaces: [contacto, mapa] };
    const palabrasGenericas = new Set(['palacio','teatro','museo','cafe','estadio','mercado','nacional','pasaje','calle','buenos','aires','sobre','retrato','mural','lineas']);
    const puntos = datos.recorridos.flatMap(r => r.puntos);
    const punto = puntos.find(p => consulta.includes(normalizar(p.nombre))) || puntos.find(p => normalizar(p.nombre).split(' ').some(token => token.length >= 4 && !palabrasGenericas.has(token) && consulta.split(' ').includes(token)));
    if (punto) {
      const datosVisita = /horario|abiert|hora|cuando/.test(consulta) ? punto.horario : /duracion|tiempo|tarda/.test(consulta) ? punto.duracion : punto.descripcion;
      return { texto: punto.nombre + '. ' + datosVisita + ' Ubicación: ' + punto.direccion + '.', enlaces: [enlace('Ver fotografía e información de ' + punto.nombre, 'pantallas/puntos/' + punto.id + '.html'), mapa] };
    }
    if (/reserv|solicitud|inscrib|confirm|pago|pagar|cancelar/.test(consulta)) return { texto: 'En Planificá tu visita elegí una temática, entre 1 y 20 personas, fecha y guía impresa opcional. El total se calcula en ARS. Antes de confirmar podés revisar, editar o limpiar tu selección. Es una simulación: no se cobran importes ni se reservan lugares.', enlaces: [enlace('Planificar una experiencia', 'pantallas/reserva/index.html')] };
    if (recorrido) return { texto: recorrido.nombre + ': ' + recorrido.duracion + '. Podés explorar ' + recorrido.puntos.length + ' fichas: ' + recorrido.puntos.map(p => p.nombre).join(', ') + '. ' + (recorrido.id === 'arte-urbano' ? 'Se conservan las once fotografías y descripciones de Lara, con acceso al mapa de cada obra.' : 'Elegí las paradas según tus intereses y consultá el acceso de cada espacio.'), enlaces: [enlace('Explorar ' + recorrido.nombre, 'pantallas/' + recorrido.id + '/index.html'), mapa] };
    if (/mapa|ubicacion|recorrido|paradas|itinerario/.test(consulta)) return { texto: 'Porteña reúne cinco temáticas y 31 fichas con ubicación. El mapa incluye filtros, marcadores numerados y acceso a cada lugar. Podés explorar Buenos Aires, seleccionar una temática o usar Ver todos los puntos para incluir Santa Clara del Mar.', enlaces: [mapa, enlace('Elegir un recorrido', 'index.html#recorridos')] };
    const tokens = consulta.split(' ').filter(t => t.length > 2 && !palabrasVacias.has(t));
    let mejor = null;
    let puntaje = 0;
    datos.preguntas.forEach(p => {
      const titulo = normalizar(p.pregunta);
      const contenido = normalizar(p.respuesta);
      const valor = tokens.reduce((n, t) => n + (titulo.includes(t) ? 3 : contenido.includes(t) ? 1 : 0), 0);
      if (valor > puntaje) { mejor = p; puntaje = valor; }
    });
    if (mejor && puntaje >= 2) return { texto: mejor.respuesta, enlaces: [faq] };
    return { texto: 'No encontré una respuesta para esa consulta. Puedo ayudarte con precios, reservas, recorridos, accesibilidad y las ubicaciones publicadas. Probá, por ejemplo, «¿Dónde está Realidades poco frecuentes?» o consultá la lista de preguntas.', enlaces: [faq, contacto] };
  }

  const contenedor = document.createElement('div');
  contenedor.className = 'chat-portena no-imprimir';
  contenedor.innerHTML = '<button id="abrir-chat" class="chat-lanzador" type="button" aria-expanded="false" aria-controls="panel-chat">Chat de Porteña <span aria-hidden="true">↗</span></button><aside id="panel-chat" class="chat-panel" role="dialog" aria-modal="false" aria-labelledby="titulo-chat" hidden><div class="chat-cabecera"><div><h2 id="titulo-chat">Chat de Porteña</h2><p>Preguntas frecuentes sobre tu visita</p></div><button id="cerrar-chat" type="button" aria-label="Cerrar chat de Porteña">✕</button></div><div id="conversacion-chat" class="chat-conversacion" role="log" aria-live="polite" aria-relevant="additions" aria-label="Conversación con el asistente"></div><div class="chat-sugerencias" aria-label="Preguntas sugeridas"><button type="button" data-pregunta="¿Cuáles son los precios?">Precios</button><button type="button" data-pregunta="¿Cómo reservo una visita?">Reservas</button><button type="button" data-pregunta="¿Dónde está Realidades poco frecuentes?">Arte urbano</button></div><form id="formulario-chat" class="chat-formulario" novalidate><label for="consulta-chat">Tu pregunta</label><div class="chat-envio"><input id="consulta-chat" name="consulta" type="text" maxlength="240" autocomplete="off" required placeholder="Por ejemplo: ¿cuánto cuesta cine?" aria-describedby="error-chat"><button type="submit">Enviar</button></div><p id="error-chat" class="error-campo" hidden></p></form><div class="chat-pie"><a id="enlace-faq-chat">Ver preguntas frecuentes</a><button id="limpiar-chat" type="button">Limpiar conversación</button></div></aside>';
  document.body.append(contenedor);
  const abrir = document.getElementById('abrir-chat');
  const panel = document.getElementById('panel-chat');
  const entrada = document.getElementById('consulta-chat');
  const log = document.getElementById('conversacion-chat');
  const error = document.getElementById('error-chat');
  document.getElementById('enlace-faq-chat').href = faq.href;
  let focoAnterior = abrir;
  function mensaje(autor, texto, enlaces = []) {
    const bloque = document.createElement('div');
    bloque.className = 'chat-mensaje ' + (autor === 'Vos' ? 'chat-usuario' : 'chat-respuesta');
    const nombre = document.createElement('strong');
    nombre.textContent = autor;
    const contenido = document.createElement('p');
    contenido.textContent = texto;
    bloque.append(nombre, contenido);
    enlaces.forEach(destino => {
      const a = document.createElement('a');
      a.href = destino.href;
      a.textContent = destino.texto + ' →';
      bloque.append(a);
    });
    log.append(bloque);
    while (log.children.length > 40) log.firstElementChild.remove();
    log.scrollTop = log.scrollHeight;
  }
  function saludo() { mensaje('Porteña', '¡Hola! Preguntame por recorridos, precios, reservas o por una obra de la galería. También podés elegir una pregunta sugerida.'); }
  function mostrarChat(origen) {
    focoAnterior = origen || abrir;
    panel.hidden = false;
    abrir.setAttribute('aria-expanded', 'true');
    entrada.focus();
  }
  function cerrarChat() {
    panel.hidden = true;
    abrir.setAttribute('aria-expanded', 'false');
    focoAnterior.focus();
  }
  abrir.addEventListener('click', function () { if (panel.hidden) mostrarChat(abrir); else cerrarChat(); });
  document.getElementById('cerrar-chat').addEventListener('click', cerrarChat);
  document.addEventListener('click', function (evento) { const boton = evento.target.closest('[data-abrir-chat]'); if (boton) mostrarChat(boton); });
  document.addEventListener('keydown', function (evento) { if (evento.key === 'Escape' && !panel.hidden) { evento.preventDefault(); cerrarChat(); } });
  function enviar(consulta) {
    const texto = consulta.trim();
    error.hidden = true;
    entrada.removeAttribute('aria-invalid');
    if (!texto || texto.length > 240) {
      error.textContent = !texto ? 'Escribí una pregunta antes de enviar.' : 'La pregunta debe tener hasta 240 caracteres.';
      error.hidden = false;
      entrada.setAttribute('aria-invalid', 'true');
      entrada.focus();
      return;
    }
    mensaje('Vos', texto);
    const respuesta = responder(texto);
    mensaje('Porteña', respuesta.texto, respuesta.enlaces);
    entrada.value = '';
    entrada.focus();
  }
  document.getElementById('formulario-chat').addEventListener('submit', function (evento) { evento.preventDefault(); enviar(entrada.value); });
  contenedor.querySelectorAll('[data-pregunta]').forEach(boton => boton.addEventListener('click', function () { enviar(boton.dataset.pregunta); }));
  document.getElementById('limpiar-chat').addEventListener('click', function () {
    log.replaceChildren();
    entrada.value = '';
    entrada.removeAttribute('aria-invalid');
    error.hidden = true;
    saludo();
    entrada.focus();
  });
  entrada.addEventListener('input', function () { error.hidden = true; entrada.removeAttribute('aria-invalid'); });
  saludo();
})();
