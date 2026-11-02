const { test } = require('node:test');
const assert = require('node:assert/strict');
function luminancia(hex) {
  const valores=hex.replace('#','').match(/../g).map(c=>parseInt(c,16)/255).map(c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4);
  return .2126*valores[0]+.7152*valores[1]+.0722*valores[2];
}
function contraste(a,b) { const x=luminancia(a),y=luminancia(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05); }
test('Combinaciones de texto del Design System superan contraste 4.5:1', () => {
  const combinaciones=[['#171714','#fffef8'],['#171714','#f3f0e8'],['#fffef8','#171714'],['#59574e','#fffef8'],['#59574e','#f3f0e8'],['#a11c16','#fffef8'],['#b42c0b','#fffef8'],['#aaa89f','#171714'],...['#e9ff48','#55d88a','#5ba7ff','#ff6b3d','#d865ff','#ffd43b'].map(c=>['#171714',c])];
  for(const [texto,fondo] of combinaciones) assert.ok(contraste(texto,fondo)>=4.5,texto+' sobre '+fondo+': '+contraste(texto,fondo));
});
test('El foco tiene contraste 3:1 con los fondos claros y oscuros usados', () => {
  for(const fondo of ['#fffef8','#f3f0e8']) assert.ok(contraste('#2454bb',fondo)>=3,'Foco azul sobre '+fondo);
  for(const fondo of ['#e9ff48','#55d88a','#5ba7ff','#ff6b3d','#d865ff','#ffd43b']) assert.ok(contraste('#171714',fondo)>=3,'Foco oscuro sobre '+fondo);
  assert.ok(contraste('#e9ff48','#171714')>=3);
});
