/** Colores compartidos con el diseño de Porteña en Figma. */
module.exports = {
  content: ['./index.html', './pantallas/**/*.html', './js/*.js'],
  theme: {
    extend: {
      colors: {
        tinta: '#171714', papel: '#fffef8', arena: '#f3f0e8', borde: '#cbc6b8',
        lima: '#e9ff48', futbol: '#55d88a', arquitectura: '#5ba7ff',
        gastronomia: '#ff6b3d', arte: '#d865ff', cine: '#ffd43b'
      },
      fontFamily: {
        serif: ['Lora', 'Georgia', 'serif'],
        sans: ['DM Sans', 'Arial', 'sans-serif']
      }
    }
  },
  plugins: []
};
