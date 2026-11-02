const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');
const datos = require('../datos/recorridos.json');
const raiz = path.resolve(__dirname, '..');
const script = fs.readFileSync(path.join(raiz, 'js/sitio.js'), 'utf8');
function abrir(ruta, query = '') {
  const dom = new JSDOM(fs.readFileSync(path.join(raiz, ruta), 'utf8'), { url: 'https://ejemplo.test/' + ruta + query, runScripts: 'outside-only' });
  dom.window.eval(script);
  const d = dom.window.document;
  return { dom, d, cambiar(id, valor) {
    const campo = d.getElementById(id);
    if (typeof valor === 'boolean') campo.checked = valor; else campo.value = valor;
    campo.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
  }, enviar(id) { d.getElementById(id).dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true })); } };
}
function reservaValida(t) {
  t.cambiar('reserva-nombre', 'Ana Pérez'); t.cambiar('reserva-correo', 'ana@example.com');
  t.cambiar('recorrido', '12000'); t.cambiar('personas', '2'); t.cambiar('fecha', t.d.getElementById('fecha').min);
}
test('Todas las páginas: idioma, h1, título, landmarks, enlaces, anclas, imágenes y etiquetas', () => {
  const archivos = ['index.html', ...fs.readdirSync(path.join(raiz, 'pantallas'), { recursive: true }).filter(f=>f.endsWith('.html')).map(f=>'pantallas/'+f)];
  for (const archivo of archivos) {
    const dom = new JSDOM(fs.readFileSync(path.join(raiz, archivo), 'utf8'), { url: 'https://ejemplo.test/' + archivo.replaceAll('\\','/'), runScripts: 'outside-only' });
    const d = dom.window.document;
    assert.equal(d.documentElement.lang, 'es', archivo);
    assert.equal(d.querySelectorAll('h1').length, 1, archivo);
    for (const selector of ['title','header','main','footer','meta[name="viewport"]','a[href="#contenido"]']) assert.ok(d.querySelector(selector), archivo+' '+selector);
    const ids = [...d.querySelectorAll('[id]')].map(n=>n.id);
    assert.equal(ids.length, new Set(ids).size, archivo+' IDs únicos');
    for (const imagen of d.querySelectorAll('img')) assert.ok(imagen.hasAttribute('alt'), archivo+' alt');
    for (const marco of d.querySelectorAll('iframe')) assert.ok(marco.title, archivo+' iframe con título');
    for (const campo of d.querySelectorAll('input:not([type="checkbox"]),select,textarea')) assert.ok(d.querySelector('label[for="'+campo.id+'"]'), archivo+' '+campo.id);
    for (const elemento of d.querySelectorAll('[href],[src],source[srcset]')) {
      const valor = elemento.getAttribute('href') || elemento.getAttribute('src') || elemento.getAttribute('srcset');
      if (!valor || /^(https?:|mailto:|tel:|data:)/.test(valor)) continue;
      const [rutaConQuery, ancla] = valor.split('#');
      const ruta = decodeURIComponent(rutaConQuery.split('?')[0]);
      let destino = ruta ? path.resolve(path.dirname(path.join(raiz,archivo)), ruta) : path.join(raiz,archivo);
      if (fs.existsSync(destino) && fs.statSync(destino).isDirectory()) destino = path.join(destino,'index.html');
      assert.ok(fs.existsSync(destino), archivo+' recurso '+valor);
      if (ancla && destino.endsWith('.html')) {
        const otro = new JSDOM(fs.readFileSync(destino,'utf8'));
        assert.ok(otro.window.document.getElementById(ancla), archivo+' ancla '+valor);
        otro.window.close();
      }
    }
    dom.window.eval(script); // Ningún script compartido falla en páginas sin formularios.
    dom.window.close();
  }
  console.log('Páginas revisadas:', archivos.length);
});
test('Contacto: errores comprensibles, foco y corrección sin perder datos', () => {
  const t=abrir('pantallas/contacto/index.html');
  t.enviar('formulario-contacto');
  assert.equal(t.d.activeElement.id,'nombre');
  assert.equal(t.d.querySelectorAll('[aria-invalid="true"]').length,4);
  t.cambiar('nombre',' A '); t.cambiar('correo','mal'); t.cambiar('motivo','Accesibilidad'); t.cambiar('mensaje','          ');
  t.enviar('formulario-contacto');
  assert.equal(t.d.getElementById('estado-contacto').hidden,true);
  assert.equal(t.d.getElementById('nombre').value,' A ');
  t.cambiar('nombre','Ana'); t.cambiar('correo','ana@example.com'); t.cambiar('mensaje','Necesito información de acceso.');
  t.enviar('formulario-contacto');
  assert.match(t.d.getElementById('estado-contacto').textContent,/Consulta validada, Ana/);
  assert.match(t.d.getElementById('estado-contacto').textContent,/no se envió ni se guardó/);
  assert.equal(t.d.activeElement.id,'estado-contacto');
  assert.equal(t.d.querySelectorAll('[aria-invalid="true"]').length,0);
  t.dom.window.close();
});
test('Las cinco tarifas: límites 1 y 20, con y sin adicional, resumen y confirmación', () => {
  for (const r of datos.recorridos) for (const n of [1,20]) for (const extra of [false,true]) {
    const t=abrir('pantallas/reserva/index.html'); reservaValida(t);
    t.cambiar('recorrido', String(r.precio)); t.cambiar('personas',String(n)); t.cambiar('adicional',extra);
    const esperado='ARS $ '+((r.precio+(extra?3000:0))*n).toLocaleString('es-AR');
    assert.equal(t.d.getElementById('importe-total').textContent,esperado);
    t.enviar('formulario-reserva');
    assert.equal(t.d.getElementById('resumen-reserva').hidden,false);
    assert.equal(t.d.getElementById('resumen-total').textContent,esperado);
    assert.equal(t.d.getElementById('resumen-recorrido').textContent,r.nombre);
    t.d.getElementById('confirmar-reserva').click();
    assert.match(t.d.getElementById('estado-reserva').textContent,/Solicitud simulada confirmada/);
    assert.ok(t.d.getElementById('estado-reserva').textContent.includes(esperado));
    t.dom.window.close();
  }
});
test('Reserva: rechaza cantidad inválida, fecha anterior y nombres vacíos', () => {
  const t=abrir('pantallas/reserva/index.html'); reservaValida(t);
  for (const n of ['0','21','1.5','-1','']) {
    t.cambiar('personas',n); t.enviar('formulario-reserva');
    assert.equal(t.d.getElementById('resumen-reserva').hidden,true,'cantidad '+n);
    assert.equal(t.d.getElementById('personas').getAttribute('aria-invalid'),'true');
  }
  t.cambiar('personas','2'); t.cambiar('fecha','2000-01-01'); t.enviar('formulario-reserva');
  assert.equal(t.d.getElementById('fecha').getAttribute('aria-invalid'),'true');
  t.cambiar('fecha',t.d.getElementById('fecha').min); t.cambiar('reserva-nombre','    '); t.enviar('formulario-reserva');
  assert.equal(t.d.getElementById('resumen-reserva').hidden,true);
  t.dom.window.close();
});
test('Editar, cambiar y limpiar impiden confirmar un resumen anterior', async () => {
  const t=abrir('pantallas/reserva/index.html'); reservaValida(t); t.enviar('formulario-reserva');
  t.cambiar('personas','3'); t.d.getElementById('confirmar-reserva').click();
  assert.equal(t.d.getElementById('estado-reserva').hidden,true);
  t.enviar('formulario-reserva'); t.d.getElementById('editar-reserva').click();
  assert.equal(t.d.activeElement.id,'recorrido');
  t.enviar('formulario-reserva'); t.d.getElementById('formulario-reserva').reset();
  await new Promise(resolve=>setTimeout(resolve,5));
  assert.equal(t.d.getElementById('resumen-reserva').hidden,true);
  assert.equal(t.d.getElementById('importe-total').textContent,'Completá tu selección');
  assert.equal(t.d.querySelectorAll('[aria-invalid="true"]').length,0);
  t.dom.window.close();
});
test('Reserva preseleccionada desde cada temática y parámetro desconocido seguro', () => {
  for (const r of datos.recorridos) {
    const t=abrir('pantallas/reserva/index.html','?recorrido='+r.id);
    assert.equal(t.d.getElementById('recorrido').value,String(r.precio)); t.dom.window.close();
  }
  const t=abrir('pantallas/reserva/index.html','?recorrido=desconocido');
  assert.equal(t.d.getElementById('recorrido').value,''); t.dom.window.close();
  const desdeChat=abrir('pantallas/reserva/index.html','?recorrido=futbol&personas=2&guia=si');
  assert.equal(desdeChat.d.getElementById('importe-total').textContent,'ARS $ 30.000');desdeChat.dom.window.close();
  const invalido=abrir('pantallas/reserva/index.html','?recorrido=futbol&personas=99&guia=no');
  assert.equal(invalido.d.getElementById('personas').value,'1');assert.equal(invalido.d.getElementById('adicional').checked,false);invalido.dom.window.close();
});
test('FAQ: búsqueda sin tildes, estado vacío y recuperación', () => {
  const t=abrir('pantallas/preguntas-frecuentes/index.html');
  t.cambiar('buscar-preguntas','futbol'); assert.match(t.d.getElementById('estado-preguntas').textContent,/^[1-9]/);
  t.cambiar('buscar-preguntas','zzzzzz'); assert.match(t.d.getElementById('estado-preguntas').textContent,/No encontramos/);
  t.cambiar('buscar-preguntas',''); assert.equal(t.d.querySelectorAll('#preguntas details:not([hidden])').length,10);
  t.dom.window.close();
});
test('Menú: aria-expanded correcto, Escape y foco de regreso', () => {
  const t=abrir('index.html'); const b=t.d.getElementById('boton-menu');
  assert.equal(b.getAttribute('aria-expanded'),'false'); b.click();
  assert.equal(b.getAttribute('aria-expanded'),'true');
  t.d.dispatchEvent(new t.dom.window.KeyboardEvent('keydown',{key:'Escape'}));
  assert.equal(t.d.getElementById('menu').hidden,true); assert.equal(t.d.activeElement,b); t.dom.window.close();
});
test('Mapa: 23 ubicaciones y selección anunciada', () => {
  const t=abrir('pantallas/mapa/index.html'); const enlaces=t.d.querySelectorAll('[data-mapa]');
  assert.equal(enlaces.length,23); enlaces[0].dispatchEvent(new t.dom.window.Event('click'));
  assert.equal(enlaces[0].getAttribute('aria-current'),'location');
  assert.match(t.d.getElementById('estado-mapa').textContent,/La Bombonera/); t.dom.window.close();
});
test('Tres paradas por temática y gastronomía con las fotos de la Tarea 1', () => {
  for (const r of datos.recorridos) if (r.id!=='arte-urbano') assert.equal(r.puntos.length,3,r.id);
  datos.recorridos.find(r=>r.id==='gastronomia').puntos.forEach((p,i) => {
    assert.equal(p.imagen,'img/gastronomia/Gastronomia-'+(i+1)+'.jpeg');
    const ficha=abrir('pantallas/puntos/'+p.id+'.html'); const figura=ficha.d.querySelector('main figure');
    assert.equal(figura.querySelector('img').getAttribute('src'),'../../'+p.imagen);
    assert.match(figura.textContent,/Bárbara Gaito/); ficha.dom.window.close();
  });
});
test('Arte urbano conserva las once fotos, descripciones y ubicaciones originales', () => {
  const originales=require('../datos/arte-actividad-1.json').puntos;
  const manifiesto=require('../datos/origen-fotografias-arte.json');
  const crypto=require('node:crypto');
  for (const foto of manifiesto.fotografias) {
    const bytes=fs.readFileSync(path.join(raiz,foto.archivo));
    const sha=crypto.createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex');
    assert.equal(sha,foto.shaGit,'Fotografía idéntica al repositorio original: '+foto.archivo);
  }
  const t=abrir('pantallas/arte-urbano/index.html');
  assert.equal(t.d.querySelectorAll('#paradas article').length,11);
  for (const p of originales) {
    const tarjeta=t.d.getElementById('obra-'+p.id);
    assert.ok(tarjeta.textContent.includes(p.descripcion));
    assert.ok(tarjeta.textContent.includes(p.direccion));
    assert.equal(tarjeta.querySelector('img').getAttribute('src'),'../../'+p.imagen);
    const ficha=abrir('pantallas/puntos/'+p.id+'.html');
    assert.ok(ficha.d.querySelector('main').textContent.includes(p.descripcion));
    assert.equal(ficha.d.querySelector('main figure img').alt,p.alt);
    if(p.tipoUbicacion==='sin-direccion') assert.equal(ficha.d.querySelectorAll('iframe').length,0);
    ficha.dom.window.close();
  }
  t.dom.window.close();
});
test('Impresión abre las fichas y restaura su estado', () => {
  const t=abrir('pantallas/futbol/index.html'); const detalles=t.d.querySelectorAll('details');
  detalles[1].open=true; t.dom.window.dispatchEvent(new t.dom.window.Event('beforeprint'));
  assert.ok([...detalles].every(d=>d.open)); t.dom.window.dispatchEvent(new t.dom.window.Event('afterprint'));
  assert.equal(detalles[0].open,false); assert.equal(detalles[1].open,true); t.dom.window.close();
});
