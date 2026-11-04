const fs = require('node:fs');
const datos = require('../datos/recorridos.json');
const archivo = 'datos/ubicaciones.json';
const registro = fs.existsSync(archivo) ? JSON.parse(fs.readFileSync(archivo, 'utf8')) : {
  fuente: 'API USIG - Gobierno de la Ciudad de Buenos Aires',
  documentacion: 'https://usig.buenosaires.gob.ar/apis/', fechaConsulta: '2026-11-02', puntos: {}
};
const consultas = datos.recorridos.flatMap(r => r.puntos.filter(p => r.id !== 'arte-urbano' || p.consultaGeocodificacion).map(p => ({ id: p.id, consulta: p.consultaGeocodificacion || p.direccion.split(',')[0], referencia: r.id === 'arte-urbano' })));
const cache = new Map(Object.values(registro.puntos).map(p => [p.consulta, p]));
(async function () {
  for (const consulta of consultas) {
    if (registro.puntos[consulta.id]) continue;
    try {
      let resultado = cache.get(consulta.consulta);
      if (!resultado) {
        const url = 'https://servicios.usig.buenosaires.gob.ar/normalizar/?direccion=' + encodeURIComponent(consulta.consulta) + '&geocodificar=TRUE';
        const respuesta = await fetch(url, { signal: AbortSignal.timeout(20000), headers: { 'User-Agent': 'Portena-Grupo5/1.0 (+https://github.com/BarbaraGaito/Actividad-2-Grupo-5)' } });
        if (!respuesta.ok) throw Error('HTTP ' + respuesta.status);
        const datosGeo = await respuesta.json();
        const direccion = datosGeo.direccionesNormalizadas.find(d => d.cod_partido === 'caba' && d.coordenadas && d.coordenadas.srid === 4326);
        if (!direccion) throw Error('No hay una coincidencia de CABA con coordenadas WGS84');
        const lat = Number(direccion.coordenadas.y), lon = Number(direccion.coordenadas.x);
        if (!(lat > -34.8 && lat < -34.45 && lon > -58.65 && lon < -58.3)) throw Error('Fuera de CABA');
        resultado = { consulta: consulta.consulta, direccionNormalizada: direccion.direccion, lat, lon, urlFuente: url };
        cache.set(consulta.consulta, resultado);
      }
      registro.puntos[consulta.id] = { ...resultado, tipo: consulta.referencia ? 'referencia de intersección' : 'dirección de la ficha' };
      fs.writeFileSync(archivo, JSON.stringify(registro, null, 2) + '\n');
      console.log(consulta.id + ': ' + resultado.direccionNormalizada + ' (' + resultado.lat + ', ' + resultado.lon + ')');
    } catch (e) { console.error(consulta.id + ': ' + e.message); process.exitCode = 1; }
  }
})();
