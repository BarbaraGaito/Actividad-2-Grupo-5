/* Comparte el mismo contenido de recorridos y FAQ con el chat. */
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');
const datos = require('../datos/recorridos.json');
const faq = new JSDOM(fs.readFileSync('pantallas/preguntas-frecuentes/index.html', 'utf8'));
const ayuda = {
  adicional: 3000,
  recorridos: datos.recorridos.map(r => ({ id: r.id, nombre: r.nombre, precio: r.precio, duracion: r.duracion, puntos: r.puntos })),
  preguntas: [...faq.window.document.querySelectorAll('#preguntas details')].map(d => ({ pregunta: d.querySelector('summary').textContent.trim(), respuesta: d.querySelector('p').textContent.trim() }))
};
faq.window.close();
fs.writeFileSync('js/contenido-ayuda.js', '/* Generado desde datos/recorridos.json y las FAQ. No editar a mano. */\nwindow.PORTEÑA_AYUDA = ' + JSON.stringify(ayuda, null, 2) + ';\n');
const ubicaciones = JSON.parse(fs.readFileSync('datos/ubicaciones.json', 'utf8'));
const datosMapa = {
  teselas: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  recorridos: datos.recorridos.map(r => ({ id: r.id, nombre: r.nombre, color: r.color, puntos: r.puntos.map((p,i) => ({ id: p.id, nombre: p.nombre, direccion: p.direccion, numero: i+1, referencia: Boolean(p.tipoUbicacion), nota: p.notaUbicacion || '', posicion: ubicaciones.puntos[p.id] || null })) }))
};
fs.writeFileSync('js/contenido-mapa.js', '/* Coordenadas de direcciones públicas: API USIG. Ver datos/ubicaciones.json. */\nwindow.PORTEÑA_MAPA = ' + JSON.stringify(datosMapa, null, 2) + ';\n');
const paginas = ['index.html', ...fs.readdirSync('pantallas', { recursive: true }).filter(p => p.endsWith('.html')).map(p => path.join('pantallas', p))];
for (const pagina of paginas) {
  let html = fs.readFileSync(pagina, 'utf8');
  const prefijo = pagina === 'index.html' ? '' : '../../';
  // La actualización es idempotente, incluso si la plantilla ya tenía el chat.
  html = html.replace(/\s*<script src="(?:\.\.\/)*js\/(?:contenido-ayuda|chat)\.js" defer><\/script>/g, '');
  html = html.replace(/\s*<script src="(?:\.\.\/)*(?:js\/(?:contenido-mapa|mapa)|vendor\/leaflet\/leaflet)\.js" defer><\/script>/g, '').replace(/\s*<link rel="stylesheet" href="(?:\.\.\/)*vendor\/leaflet\/leaflet.css">/g, '');
  html = html.replace('</head>', `  <script src="${prefijo}js/contenido-ayuda.js" defer></script>\n  <script src="${prefijo}js/chat.js" defer></script>\n</head>`);
  if (pagina === 'index.html' || pagina.replaceAll('\\','/') === 'pantallas/mapa/index.html') {
    html = html.replace('</head>', `  <link rel="stylesheet" href="${prefijo}vendor/leaflet/leaflet.css">\n  <script src="${prefijo}vendor/leaflet/leaflet.js" defer></script>\n  <script src="${prefijo}js/contenido-mapa.js" defer></script>\n  <script src="${prefijo}js/mapa.js" defer></script>\n</head>`);
  }
  if (pagina.replaceAll('\\', '/') === 'pantallas/preguntas-frecuentes/index.html') {
    html = html.replace('Consultá las respuestas sobre los recorridos, la planificación y el uso del sitio.', 'Escribí tu consulta en el chat o explorá las respuestas sobre recorridos, precios y planificación.');
    if (!html.includes('id="acceso-chat"')) {
      html = html.replace('<div class="max-w-4xl">', '<div class="max-w-4xl"><div id="acceso-chat" class="tarjeta mb-8"><h2 class="mb-4">Chat de preguntas frecuentes</h2><p class="mb-6">Consultá por un recorrido, la ubicación de una obra o el precio para tu grupo. Por ejemplo: «¿Cuánto cuesta fútbol para 2 personas con guía impresa?».</p><button type="button" class="boton" data-abrir-chat>Abrir chat de Porteña</button><noscript><p class="ayuda">El chat necesita JavaScript. Las respuestas de la lista siguen disponibles sin activarlo.</p></noscript></div>');
    }
  }
  fs.writeFileSync(pagina, html);
}
console.log('Chat de preguntas frecuentes integrado en ' + paginas.length + ' páginas.');
