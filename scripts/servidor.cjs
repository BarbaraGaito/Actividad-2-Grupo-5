/* Servidor estático sin dependencias, compatible con Windows, macOS y Linux. */
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const raiz = path.resolve(__dirname, '..');
const tipos = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.ttf': 'font/ttf', '.pdf': 'application/pdf', '.json': 'application/json' };
http.createServer((req, res) => {
  let relativo;
  try { relativo = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
  catch { res.writeHead(400); return res.end('Ruta inválida'); }
  let archivo = path.resolve(raiz, '.' + relativo);
  if (!archivo.startsWith(raiz + path.sep) && archivo !== raiz) { res.writeHead(403); return res.end('Acceso no permitido'); }
  const segmentos = path.relative(raiz, archivo).split(path.sep);
  if (segmentos.some(s => s.startsWith('.')) || ['node_modules', 'tmp', 'scripts', 'tests'].includes(segmentos[0])) { res.writeHead(403); return res.end('Acceso no permitido'); }
  if (fs.existsSync(archivo) && fs.statSync(archivo).isDirectory()) archivo = path.join(archivo, 'index.html');
  fs.readFile(archivo, (error, contenido) => {
    if (error) { res.writeHead(404); return res.end('Página no encontrada'); }
    res.writeHead(200, { 'Content-Type': tipos[path.extname(archivo)] || 'application/octet-stream' });
    res.end(contenido);
  });
}).listen(8000, '127.0.0.1', () => console.log('Porteña: http://localhost:8000'));
