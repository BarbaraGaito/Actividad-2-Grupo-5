# Porteña · Buenos Aires, a pie y con tiempo

Actividad 3 · Grupo 5 · Diseño y Desarrollo Web · Profesora Patricia Carina Litovicius.

Guía de recorridos culturales para turistas nacionales e internacionales y residentes curiosos. Reúne fútbol, arquitectura, gastronomía, arte urbano y cine. Su objetivo es acercar historias, imágenes e información práctica para explorar la ciudad al ritmo de cada visitante.

## Ver el sitio

- [Sitio publicado en GitHub Pages](https://barbaragaito.github.io/Actividad-2-Grupo-5/).
- [Repositorio público grupal](https://github.com/BarbaraGaito/Actividad-2-Grupo-5).
- [Prototipo original y diseño de la Actividad 2 en Figma](https://www.figma.com/design/xHqN3NQfBRSYfUmpRroRao/Actividad-2-Grupo-5?node-id=0-1).
- [Design System de la versión implementada](pantallas/design-system/index.html).
- [Documento 1: diseño y contenido](output/pdf/01-diseno-contenido.pdf).
- [Documento 2: desarrollo e implementación](output/pdf/02-desarrollo-implementacion.pdf).

**Estado de esta revisión:** los cambios están locales para revisión del grupo. La URL pública muestra la versión que se haya subido a GitHub, no necesariamente estos archivos. No se realizaron commits ni un despliegue de esta revisión. Las diferencias respecto del Figma original están explicadas en los documentos.

Para verla en esta computadora:

```sh
npm start
```

Abrir <http://localhost:8000>. Solo requiere Node.js para el servidor local; no hace falta instalar dependencias para visualizar los archivos ya compilados. Google Maps y las fuentes de consulta externas requieren internet. Los datos de formularios permanecen únicamente en memoria durante su uso.

## Funcionalidades

- Inicio con propuesta, logo, acceso a cinco temáticas, mapa general y recomendaciones.
- Cinco recorridos con tres paradas cada uno (arte urbano reúne cinco obras de su galería) y tres guías de arquitectura por comunas, una parada por comuna.
- 17 fichas individuales con descripción, actividades, duración orientativa, acceso, horarios, imágenes, fuentes de consulta (en arte urbano y gastronomía, el crédito de la foto) y navegación entre fichas. Todas tienen acceso a su ubicación.
- Gastronomía: tres cafeterías de la galería Cafeterías en CABA, de la [Tarea 1 de Bárbara Gaito](https://github.com/BarbaraGaito/Tarea-1-Gaito), con sus fotografías originales (`img/gastronomia/Gastronomia-1.jpeg` a `Gastronomia-3.jpeg`).
- Arte urbano: cinco fotografías propias, descripciones y ubicaciones/contextos originales de Lara Trinidad Alonso, tomadas de [Paredes que Hablan, Actividad 1](https://github.com/Larialonso/Disenoydesarrolloweb/tree/main/Paredes-que-hablan). Cada fotografía se puede ver completa en su ficha. Se eligieron las cinco obras con dirección concreta en la Ciudad de Buenos Aires; sus descripciones se conservan sin cambios. La portada de la página usa otra fotografía de Lara (Expresión colectiva).
- Mapa general con marcadores de las 17 fichas con el color y el número de cada temática, filtros por temática, selección desde el listado y ventanas con acceso a cada ficha. Hospitales corresponde a Realidades poco frecuentes. Los itinerarios de las demás temáticas se abren en Google Maps.
- Contacto simulado con nombre, correo, motivo y mensaje; validación HTML y JavaScript, errores asociados a los campos y confirmación.
- Planificación simulada con cinco opciones, nombre, correo, fecha, entre 1 y 20 personas, guía impresa opcional, cálculo automático, resumen, edición, limpieza y confirmación.
- Chat de preguntas frecuentes en las 32 páginas: permite escribir consultas, elegir preguntas sugeridas, conocer ubicaciones, calcular precios y pasar a la reserva conservando recorrido, personas y adicional. Incluye cierre con Escape, foco de regreso, limpieza de conversación y respuesta para consultas desconocidas. Usa respuestas preparadas y reglas locales; no es IA generativa. También hay diez FAQ con búsqueda sin distinción de tildes o mayúsculas. Cubre el punto 3.6 de la consigna.
- Navegación que marca la sección actual, menú móvil con Escape y foco de regreso, salto al contenido, foco visible, estados anunciados e impresión de guías con fichas desplegadas.

Las reservas y el contacto son simulaciones explícitas. No se envían mensajes, no se guardan datos personales, no se cobran importes ni se reservan lugares reales. La planificación no incluye entradas, traslados ni consumos. No se implementa una pasarela de pago.

## Precios y cálculo

| Opción | Precio por persona |
| --- | ---: |
| Fútbol | ARS $ 12.000 |
| Arquitectura | ARS $ 10.000 |
| Gastronomía | ARS $ 15.000 |
| Arte urbano | ARS $ 9.000 |
| Cine | ARS $ 11.000 |

`total = (precio unitario + adicional por persona) × personas`

Ejemplo: fútbol, 2 personas y guía impresa: `(12.000 + 3.000) × 2 = ARS $ 30.000`. Todos los valores están en pesos argentinos; no corresponde conversión ni tipo de cambio. Las fechas pasadas se rechazan usando la fecha actual de Buenos Aires, incluso si la pantalla quedó abierta desde el día anterior.

## Tecnologías

HTML5 semántico, Tailwind CSS 3.4.17 y JavaScript del navegador. Los íconos son SVG propios de trazo simple (flechas, menú y cierre) incrustados en el HTML y estilizados con Tailwind; no se usa Bootstrap ni ninguna biblioteca de íconos. No se utilizan React, Angular, Vue, backend ni base de datos. Tailwind se compila con su CLI; el CSS generado está incluido. Node.js se utiliza para desarrollo y para generar los datos del chat y del mapa. jsdom lee las preguntas frecuentes durante esa generación y no se carga en el sitio.

## Organización

```text
index.html                         Inicio
pantallas/
  futbol/, gastronomia/, cine/      Recorridos temáticos
  arte-urbano/                      Galería de cinco obras originales
  arquitectura/                    Índice y comunas 1, 2 y 3
  puntos/                          17 fichas individuales
  mapa/, contacto/, reserva/       Ubicaciones y formularios
  preguntas-frecuentes/             Ayuda funcional con búsqueda
  sobre-la-guia/, design-system/    Equipo y reglas visuales
css/entrada.css                    Tailwind y componentes compartidos
css/styles.css                     Resultado compilado, incluido en Git
css/fuentes.css                    Fuentes locales
js/sitio.js                        Validaciones y comportamiento
js/chat.js                         Chat local de preguntas frecuentes
js/mapa.js                         Marcadores y filtros del mapa
vendor/leaflet/                    Biblioteca de mapas y licencia BSD
scripts/iconos.cjs                  Íconos SVG propios que usan el chat y el mapa
datos/recorridos.json              Contenido y fuentes de todas las fichas
datos/arte-actividad-1.json         Registro fiel de la galería de Lara
img/                              Imágenes por sección, nombradas {Seccion}-{numero} (por ejemplo, Futbol-1.jpeg), y fuentes
scripts/generar-ayuda.cjs           Datos del chat y del mapa (js/contenido-*.js)
scripts/servidor.cjs                Servidor local
scripts/generar-documentos.py       Generación de los dos PDF
docs/                             Fuentes, entrega y pruebas
output/pdf/                        Documentos de entrega
```

Las páginas se entregan completas en HTML y usan rutas relativas, compatibles con el subdirectorio de GitHub Pages. El navegador no necesita un router ni descargar JSON para mostrar el contenido. Sin JavaScript se conservan las guías, imágenes, enlaces al mapa y desplegables nativos; las simulaciones solicitan activarlo.

Las fichas y las demás páginas se editan directamente en su HTML. `datos/recorridos.json` alimenta el chat y el mapa: si se modifica, ejecutar `npm run build:content` para actualizar `js/contenido-ayuda.js` y `js/contenido-mapa.js`. Un cambio de contenido en una ficha debe hacerse en los dos lugares.

```sh
npm ci
npm run build
```

`npm run watch:css` recompila estilos durante la edición. `npm run build:content` regenera los datos del chat y del mapa a partir de `datos/` y de las preguntas frecuentes. Las vistas principales conservan la composición heredada de la Actividad 2.

Para regenerar los PDF después de añadir las capturas reales:

```sh
py -m pip install -r scripts/requirements-documentos.txt
py scripts/generar-documentos.py
```

## Servicios externos, accesibilidad y recursos

Leaflet 1.9.4 dibuja los marcadores y permite filtrar las ubicaciones sobre cartografía de OpenStreetMap con atribución visible. Se sirve desde vendor/leaflet con su licencia BSD; sus estilos se limitan al mapa y no reemplazan Tailwind. Las coordenadas se guardan en datos/ubicaciones.json, con su fuente: API USIG. Google Maps se conserva para itinerarios, fichas y como respaldo. El chat funciona localmente, sin credenciales, costes ni transmisión de consultas.

Fotografías propias del grupo. Las cinco fotos de arte urbano y la portada de su página son de Lara Trinidad Alonso y conservan el origen de su Actividad 1. Las tres fotos de las paradas de gastronomía son de Bárbara Gaito y provienen de su Tarea 1. El resto proviene de los recursos ya incluidos en el prototipo grupal.

## Integrantes y responsabilidades
| Integrante | Legajo | Responsabilidad temática |
| --- | --- | --- |
| Aldana Nicolas | 1217752 | Cine: contenido y página temática. |
| Alonso Lara Trinidad | 1155144 | Arte urbano: galería, fotografías y textos de Paredes que Hablan. |
| Gaito Bárbara Denise | 1155822 | Gastronomía: contenido y página temática. |
| Gonzalez Homero Ivan | 1153714 | Arquitectura: guía por comunas y fichas. |
| Martinez Pilar | 1203885 | Fútbol: contenido y página temática. |


## Verificación y entrega

**Pendiente antes de entregar:** comprobación visual en navegador a 320, 390, 768 y 1440 px, capturas reales de esa revisión, comprobación de iframes/servicios externos, revisión de cada integrante y publicación de los cambios aprobados. El acceso al navegador de pruebas no estuvo disponible en la sesión de preparación. No se presentan como realizadas esas pruebas. Ver [control de entrega](docs/ENTREGA.md).

Para publicar los archivos aprobados, subirlos a la rama que GitHub Pages tenga configurada. Si se usa publicación desde rama, la configuración habitual para este proyecto es `main` / raíz. La carpeta incluye `.nojekyll` y CSS compilado. Revisar la URL pública y sus subpáginas después del despliegue. La configuración de Pages debe confirmarla alguien con acceso a Settings del repositorio.

Los PDF y los Markdown de `docs/` se incluyen en Git mediante excepciones a `.gitignore`. `tmp/` y `node_modules/` quedan excluidos.
