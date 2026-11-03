/* Comparte el mismo contenido de recorridos y FAQ con el chat. */
const fs = require('node:fs');
const { JSDOM } = require('jsdom');
const datos = require('../datos/recorridos.json');
const icono = require('./iconos.cjs');
const faq = new JSDOM(fs.readFileSync('pantallas/preguntas-frecuentes/index.html', 'utf8'));
const ayuda = {
  adicional: 3000,
  iconos: { flecha: icono('arrow-right'), externo: icono('arrow-up-right'), cerrar: icono('x-lg') },
  recorridos: datos.recorridos.map(r => ({ id: r.id, nombre: r.nombre, precio: r.precio, duracion: r.duracion, puntos: r.puntos })),
  preguntas: [...faq.window.document.querySelectorAll('#preguntas details')].map(d => ({ pregunta: d.querySelector('summary').textContent.replace(/\s+/g, ' ').trim(), respuesta: d.querySelector('p').textContent.replace(/\s+/g, ' ').trim() }))
};
faq.window.close();
fs.writeFileSync('js/contenido-ayuda.js', '/* Generado desde datos/recorridos.json y las FAQ. No editar a mano. */\nwindow.PORTEÑA_AYUDA = ' + JSON.stringify(ayuda, null, 2) + ';\n');
const ubicaciones = JSON.parse(fs.readFileSync('datos/ubicaciones.json', 'utf8'));
const datosMapa = {
  teselas: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  flecha: icono('arrow-right'),
  recorridos: datos.recorridos.map(r => ({ id: r.id, nombre: r.nombre, color: r.color, puntos: r.puntos.map((p, i) => ({ id: p.id, nombre: p.nombre, direccion: p.direccion, numero: i + 1, referencia: Boolean(p.tipoUbicacion), nota: p.notaUbicacion || '', posicion: ubicaciones.puntos[p.id] || null })) }))
};
fs.writeFileSync('js/contenido-mapa.js', '/* Coordenadas de direcciones públicas: API USIG. Ver datos/ubicaciones.json. */\nwindow.PORTEÑA_MAPA = ' + JSON.stringify(datosMapa, null, 2) + ';\n');
console.log('Contenido del chat y del mapa actualizado.');
