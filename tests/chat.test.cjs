const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');
const datos = require('../datos/recorridos.json');
function abrir(ruta = 'pantallas/preguntas-frecuentes/index.html') {
  const dom = new JSDOM(fs.readFileSync(ruta, 'utf8'), { url: 'https://ejemplo.test/Actividad-2-Grupo-5/' + ruta, runScripts: 'outside-only' });
  dom.window.fetch = () => { throw Error('El chat no debe transmitir consultas'); };
  dom.window.eval(fs.readFileSync('js/contenido-ayuda.js', 'utf8'));
  dom.window.eval(fs.readFileSync('js/chat.js', 'utf8'));
  const d = dom.window.document;
  return { dom, d, preguntar(texto) {
    d.getElementById('consulta-chat').value = texto;
    d.getElementById('formulario-chat').dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true }));
    return d.querySelector('#conversacion-chat .chat-mensaje:last-child').textContent;
  } };
}
test('Chat accesible: abre, cierra, Escape y foco desde ambos accesos', () => {
  const t=abrir();
  const lanzador=t.d.getElementById('abrir-chat');
  assert.equal(t.d.getElementById('panel-chat').hidden,true);
  lanzador.click(); assert.equal(lanzador.getAttribute('aria-expanded'),'true');
  assert.equal(t.d.activeElement.id,'consulta-chat');
  t.d.dispatchEvent(new t.dom.window.KeyboardEvent('keydown',{key:'Escape'}));
  assert.equal(t.d.getElementById('panel-chat').hidden,true);assert.equal(t.d.activeElement,lanzador);
  const otro=t.d.querySelector('[data-abrir-chat]');otro.click();
  t.d.getElementById('cerrar-chat').click();assert.equal(t.d.activeElement,otro);
  assert.equal(t.d.getElementById('conversacion-chat').getAttribute('role'),'log');
  assert.equal(t.d.querySelector('label[for="consulta-chat"]').textContent,'Tu pregunta');t.dom.window.close();
});
test('Chat calcula las cinco tarifas con y sin guía y coincide con la reserva', () => {
  const t=abrir();
  for(const r of datos.recorridos) for(const extra of [false,true]) {
    const respuesta=t.preguntar('¿Cuánto cuesta '+r.nombre+' para 2 personas '+(extra?'con guía impresa':'sin guía impresa')+'?');
    assert.ok(respuesta.includes('ARS $ '+((r.precio+(extra?3000:0))*2).toLocaleString('es-AR')),respuesta);
    assert.match(respuesta,/solicitud simulada/);
    const destino=new URL(t.d.querySelector('#conversacion-chat .chat-mensaje:last-child a').href);
    assert.equal(destino.searchParams.get('recorrido'),r.id);
    assert.equal(destino.searchParams.get('personas'),'2');
    assert.equal(destino.searchParams.get('guia'),extra?'si':null);
  }
  assert.match(t.preguntar('precio futbol para dos personas con guia impresa'),/30\.000/);t.dom.window.close();
});
test('Chat rechaza cantidades fuera del rango y fracciones', () => {
  const t=abrir();
  for(const numero of ['0','21','-1','1.5','1,5']) assert.match(t.preguntar('precio futbol para '+numero+' personas'),/de 1 a 20 personas/);
  t.dom.window.close();
});
test('Chat usa las ubicaciones de las obras actualizadas por la autora', () => {
  const t=abrir();
  assert.match(t.preguntar('¿Dónde está Realidades poco frecuentes?'),/estación Hospitales/);
  assert.match(t.preguntar('¿Dónde está la Scaloneta?'),/Santa Clara del Mar/);
  assert.match(t.preguntar('ubicacion de Expresión colectiva'),/Plaza del Congreso/);
  assert.match(t.preguntar('ubicacion de Luche como una abuela'),/Plaza del Congreso/);
  assert.match(t.preguntar('donde esta el Palacio Barolo'),/Av\. de Mayo 1370/);t.dom.window.close();
});
test('Chat responde FAQ, preguntas sugeridas y recupera consultas sin respuesta', () => {
  const t=abrir();
  assert.match(t.preguntar('hola'),/asistente de Porteña/);
  assert.match(t.preguntar('es gratis'),/gratuito/);
  assert.match(t.preguntar('necesito dolares'),/pesos argentinos/);
  assert.match(t.preguntar('reserva'),/simulación/);
  assert.match(t.preguntar('silla de ruedas'),/accesibilidad física/);
  assert.match(t.preguntar('internet'),/internet/);
  assert.match(t.preguntar('meteorito intergalactico'),/No encontré una respuesta/);
  const ultimo=t.d.querySelector('#conversacion-chat .chat-mensaje:last-child');
  assert.ok([...ultimo.querySelectorAll('a')].some(a=>a.href.endsWith('contacto/index.html')));
  t.d.querySelector('[data-pregunta]').click();assert.match(t.d.querySelector('#conversacion-chat .chat-mensaje:last-child').textContent,/Precios/);
  t.dom.window.close();
});
test('Chat valida vacíos, limita longitud, no interpreta HTML y permite limpiar', () => {
  const t=abrir();
  t.preguntar('   ');assert.equal(t.d.getElementById('error-chat').hidden,false);
  t.preguntar('a'.repeat(241));assert.match(t.d.getElementById('error-chat').textContent,/240 caracteres/);
  t.preguntar('<img src=x onerror=alert(1)>');assert.equal(t.d.querySelectorAll('#conversacion-chat img').length,0);
  assert.equal(t.dom.window.localStorage.length,0);
  t.d.getElementById('limpiar-chat').click();assert.equal(t.d.querySelectorAll('#conversacion-chat .chat-mensaje').length,1);
  assert.equal(t.d.getElementById('consulta-chat').value,'');assert.equal(t.d.getElementById('error-chat').hidden,true);t.dom.window.close();
});
test('Chat mantiene enlaces correctos bajo el subdirectorio de GitHub Pages', () => {
  for(const ruta of ['index.html','pantallas/puntos/bandoneonista.html']) {
    const t=abrir(ruta);t.preguntar('contacto');
    assert.equal(t.d.querySelector('#conversacion-chat .chat-mensaje:last-child a').href,'https://ejemplo.test/Actividad-2-Grupo-5/pantallas/contacto/index.html');t.dom.window.close();
  }
});
