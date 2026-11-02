const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');
function abrir(ruta='pantallas/mapa/index.html', biblioteca=true) {
  const dom = new JSDOM(fs.readFileSync(ruta,'utf8'), { url: 'https://ejemplo.test/Actividad-2-Grupo-5/'+ruta, runScripts:'outside-only', pretendToBeVisual:true });
  if(biblioteca) dom.window.eval(fs.readFileSync('vendor/leaflet/leaflet.js','utf8'));
  dom.window.eval(fs.readFileSync('js/contenido-mapa.js','utf8'));
  dom.window.eval(fs.readFileSync('js/mapa.js','utf8'));
  return { dom, d:dom.window.document };
}
test('Mapa general crea marcadores de los datos públicos y controles accesibles', () => {
  const t=abrir();
  const ubicaciones=require('../datos/ubicaciones.json').puntos;
  assert.equal(Object.keys(ubicaciones).length,23);
  const coordenadas=new Set(Object.values(ubicaciones).filter(p=>!p.fueraCABA).map(p=>p.lat+','+p.lon));
  assert.equal(t.d.querySelectorAll('.leaflet-marker-icon').length,coordenadas.size);
  assert.equal(t.d.querySelectorAll('#tema-mapa option').length,7);
  assert.equal(t.d.querySelector('label[for="tema-mapa"]').textContent,'Filtrar puntos por temática');
  assert.ok(t.d.querySelector('.leaflet-control-attribution a[href*="openstreetmap.org/copyright"]'));
  assert.ok(t.d.getElementById('mapa-recorrido').hidden);
  assert.match(t.d.getElementById('estado-mapa').textContent,/fichas ubicadas en el mapa/);
  for(const p of Object.values(ubicaciones)) {
    if(p.fueraCABA) { assert.match(p.direccionNormalizada,/Santa Clara del Mar/);continue; }
    assert.ok(p.lat>-34.8&&p.lat<-34.45&&p.lon>-58.65&&p.lon<-58.3);
    assert.match(p.direccionNormalizada,/CABA/);
  }
  t.dom.window.close();
});
test('Mapa filtra por temática y permite volver a todos los puntos', () => {
  const t=abrir();const total=t.d.querySelectorAll('.leaflet-marker-icon').length;
  const filtro=t.d.getElementById('tema-mapa');filtro.value='cine';filtro.dispatchEvent(new t.dom.window.Event('change'));
  assert.equal(t.d.querySelectorAll('.leaflet-marker-icon').length,3);
  filtro.value='arte-urbano';filtro.dispatchEvent(new t.dom.window.Event('change'));
  assert.equal(t.d.querySelectorAll('.leaflet-marker-icon').length,9);
  assert.match(t.d.getElementById('estado-mapa').textContent,/11 fichas ubicadas/);
  t.d.getElementById('restablecer-mapa').click();
  assert.equal(t.d.querySelectorAll('.leaflet-marker-icon').length,total+1);t.dom.window.close();
});
test('Seleccionar una parada o una foto localiza su marcador', () => {
  const t=abrir();
  const enlaces=[...t.d.querySelectorAll('[data-mapa]')];
  const barolo=enlaces.find(a=>a.textContent.includes('Palacio Barolo'));
  const evento=new t.dom.window.Event('click',{bubbles:true,cancelable:true});barolo.dispatchEvent(evento);
  assert.ok(evento.defaultPrevented);
  assert.match(t.d.querySelector('.leaflet-popup-content').textContent,/Palacio Barolo/);
  assert.match(t.d.getElementById('estado-mapa').textContent,/Seleccionado/);
  const general=enlaces.find(a=>a.textContent.includes('Pajarito'));
  const referencia=new t.dom.window.Event('click',{bubbles:true,cancelable:true});general.dispatchEvent(referencia);
  assert.equal(referencia.defaultPrevented,true);
  assert.match(t.d.querySelector('.leaflet-popup-content').textContent,/Pajarito/);
  assert.equal(t.d.getElementById('mapa-recorrido').hidden,true);
  assert.equal(t.d.getElementById('mapa-geografico').hidden,false);t.dom.window.close();
});
test('Inicio incluye el mapa general; si falta Leaflet se conserva el iframe y sus enlaces', () => {
  const t=abrir('index.html');assert.ok(t.d.getElementById('mapa-geografico'));t.dom.window.close();
  const sin=abrir('pantallas/mapa/index.html',false);
  assert.equal(sin.d.getElementById('mapa-geografico'),null);assert.equal(sin.d.getElementById('mapa-recorrido').hidden,false);sin.dom.window.close();
});
