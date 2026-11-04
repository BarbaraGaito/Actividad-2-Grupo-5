const trazos = {
  'arrow-right': 'M2 8h12M9 3l5 5-5 5',
  'arrow-left': 'M14 8H2M7 3 2 8l5 5',
  'arrow-up-right': 'M4 12 12 4M5.5 4H12v6.5',
  list: 'M2 4h12M2 8h12M2 12h12',
  'x-lg': 'M3 3l10 10M13 3 3 13'
};
module.exports = nombre => {
  if (!trazos[nombre]) throw new Error('Ícono inexistente: ' + nombre);
  return `<svg class="icono" viewBox="0 0 16 16" aria-hidden="true"><path d="${trazos[nombre]}"/></svg>`;
};
module.exports.trazos = trazos;
