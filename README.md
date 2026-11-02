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

Abrir <http://localhost:8000>. Solo requiere Node.js para el servidor local; no hace falta instalar dependencias para visualizar los archivos ya compilados. También se puede abrir `index.html` directamente. Google Maps y las fuentes de consulta externas requieren internet. Los datos de formularios permanecen únicamente en memoria durante su uso.

## Funcionalidades

- Inicio con propuesta, logo, acceso a cinco temáticas, mapa general y recomendaciones.
- Cinco recorridos y tres guías de arquitectura por comunas, con contenido completo.
- 31 fichas individuales con descripción, actividades, duración orientativa, acceso, horarios, imágenes, fuentes y navegación entre fichas. Todas tienen acceso a su ubicación.
- Arte urbano: las once fotografías propias, descripciones y ubicaciones/contextos originales de Lara Trinidad Alonso, tomadas de [Paredes que Hablan, Actividad 1](https://github.com/Larialonso/Disenoydesarrolloweb/tree/main/Paredes-que-hablan). Cada fotografía se puede ver completa en su ficha. Se conservan las once fotos y sus descripciones, con las ubicaciones actualizadas durante la revisión del grupo.
- Mapa general con marcadores de las 31 fichas, filtros por temática, selección desde el listado y ventanas con acceso a cada ficha. Se inicia en Buenos Aires y la opción Todos los puntos incluye Santa Clara del Mar. Plaza del Congreso corresponde a las fotos de Ni Una Menos y Luche como una abuela; Hospitales corresponde a Realidades poco frecuentes. Los itinerarios de las demás temáticas se abren en Google Maps; arquitectura se divide por comuna.
- Contacto simulado con nombre, correo, motivo y mensaje; validación HTML y JavaScript, errores asociados a los campos y confirmación.
- Planificación simulada con cinco opciones, nombre, correo, fecha, entre 1 y 20 personas, guía impresa opcional, cálculo automático, resumen, edición, limpieza y confirmación.
- Chat de preguntas frecuentes en las 46 páginas: permite escribir consultas, elegir preguntas sugeridas, conocer ubicaciones, calcular precios y pasar a la reserva conservando recorrido, personas y adicional. Incluye cierre con Escape, foco de regreso, limpieza de conversación y respuesta para consultas desconocidas. Usa respuestas preparadas y reglas locales; no es IA generativa. También hay diez FAQ con búsqueda sin distinción de tildes o mayúsculas. Cubre el punto 3.6 de la consigna.
- Menú móvil con Escape y foco de regreso, salto al contenido, foco visible, estados anunciados e impresión de guías con fichas desplegadas.

Las reservas y el contacto son simulaciones explícitas. No se envían mensajes, no se guardan datos personales, no se cobran importes ni se reservan lugares reales. La planificación no incluye entradas, traslados ni consumos. No se implementa una pasarela de pago.

## Precios y cálculo

| Opción | Precio por persona |
| --- | ---: |
| Fútbol | ARS $ 12.000 |
| Arquitectura | ARS $ 10.000 |
| Gastronomía | ARS $ 15.000 |
| Arte urbano | ARS $ 9.000 |
| Cine | ARS $ 11.000 |

La guía impresa opcional agrega ARS $ 3.000 **por persona**. Son tarifas académicas de la simulación, no tarifas de los establecimientos.

`total = (precio unitario + adicional por persona) × personas`

Ejemplo: fútbol, 2 personas y guía impresa: `(12.000 + 3.000) × 2 = ARS $ 30.000`. Todos los valores están en pesos argentinos; no corresponde conversión ni tipo de cambio. Las fechas pasadas se rechazan usando la fecha actual de Buenos Aires, incluso si la pantalla quedó abierta desde el día anterior.

## Tecnologías

HTML5 semántico, Tailwind CSS 3.4.17 y JavaScript del navegador. No se utilizan React, Angular, Vue, Bootstrap, backend ni base de datos. Tailwind se compila con su CLI; el CSS generado está incluido. Node.js se utiliza para desarrollo, generación estática y pruebas. jsdom es una dependencia de pruebas y no se carga en el sitio.

## Organización

```text
index.html                         Inicio
pantallas/
  futbol/, gastronomia/, cine/      Recorridos temáticos
  arte-urbano/                      Galería original de once obras
  arquitectura/                    Índice y comunas 1, 2 y 3
  puntos/                          31 fichas individuales
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
datos/recorridos.json              Contenido y fuentes de todas las fichas
datos/arte-actividad-1.json         Registro fiel de la galería de Lara
img/                              Fotografías, identidad y fuentes
scripts/generar-contenido.cjs       Generación de HTML estático
scripts/servidor.cjs                Servidor local
scripts/generar-documentos.py       Generación de los dos PDF
tests/                            Pruebas de contenido, interacciones, chat, mapa y contraste
docs/                             Fuentes, entrega y pruebas
output/pdf/                        Documentos de entrega
```

Las páginas se entregan completas en HTML y usan rutas relativas, compatibles con el subdirectorio de GitHub Pages. El navegador no necesita un router ni descargar JSON para mostrar el contenido. Sin JavaScript se conservan las guías, imágenes, enlaces al mapa y desplegables nativos; las simulaciones solicitan activarlo.

Para editar las fichas comunes, modificar `datos/recorridos.json`. Para corregir arte urbano, modificar el registro original en `datos/arte-actividad-1.json`: el generador sincroniza esos once registros con el archivo general. No editar manualmente las fichas generadas porque se reemplazan al recompilar. Las descripciones originales de arte urbano tienen una prueba de fidelidad.

```sh
npm ci
npm run build
npm test
```

`npm run watch:css` recompila estilos durante la edición. `npm run build:content` regenera las fichas, mapa, comunas 2/3 y Design System. Las vistas principales conservan la composición heredada de la Actividad 2.

Para regenerar los PDF después de añadir las capturas reales:

```sh
py -m pip install -r scripts/requirements-documentos.txt
py scripts/generar-documentos.py
```

## Servicios externos, accesibilidad y recursos

Leaflet 1.9.4 dibuja los marcadores y permite filtrar las ubicaciones sobre cartografía de OpenStreetMap con atribución visible. Se sirve desde vendor/leaflet con su licencia BSD; sus estilos se limitan al mapa y no reemplazan Tailwind. Las coordenadas se guardan en datos/ubicaciones.json, con sus fuentes: API USIG, Georef y mapa institucional de FADU. Google Maps se conserva para itinerarios, fichas y como respaldo. El chat funciona localmente, sin credenciales, costes ni transmisión de consultas.

Los encabezados, etiquetas, textos alternativos, enlaces descriptivos, foco visible, mensajes `role="status"`, errores textuales y navegación de teclado se explican en los PDF. Los bloques usan una base móvil y variantes `md`, `lg` y `xl`. No se afirma una certificación WCAG ni una auditoría con lector de pantalla.

Fotografías propias del grupo, según confirmación de sus integrantes para esta revisión. Las once fotos de arte urbano son de Lara Trinidad Alonso y conservan el origen de su Actividad 1. El resto proviene de los recursos ya incluidos en el prototipo grupal; no se asigna autoría individual sin confirmación. Lora, DM Sans y Manrope incluyen sus licencias SIL OFL en `img/fuentes/`. Consultar [fuentes e inventario](docs/RECURSOS.md).

## Integrantes y responsabilidades

Reparto confirmado por el grupo; no equivale a atribuir todos los cambios de esta revisión a esos integrantes.

| Integrante | Legajo | Responsabilidad temática |
| --- | --- | --- |
| Aldana Nicolas | 1217752 | Cine: contenido y página temática. |
| Alonso Lara Trinidad | 1155144 | Arte urbano: galería, once fotografías y textos de Paredes que Hablan. |
| Gaito Barbara Denise | 1555822 | Gastronomía: contenido y página temática. |
| Gonzalez Homero Ivan | 1153714 | Arquitectura: guía por comunas y fichas. |
| Martinez Pilar | 1203885 | Fútbol: contenido y página temática. |

El legajo de Bárbara se conserva como figura en el PDF de la Actividad 2. Cada integrante debe revisar su temática y aportar cambios relevantes con su propia cuenta. No se fabricó historial ni se generaron commits en nombre de terceros.

## Verificación y entrega

Las 24 pruebas automatizadas comprueban los archivos HTML, enlaces/anclas, imágenes, etiquetas, once obras originales, validación y recuperación de errores, cinco tarifas con límites y adicionales, resumen, edición, limpieza, FAQ, menú, chat, mapa real de Leaflet en DOM, contraste matemático e impresión. `jsdom` valida el DOM y la lógica; no reproduce el diseño visual ni la carga real de Google Maps.

**Pendiente antes de entregar:** comprobación visual en navegador a 320, 390, 768 y 1440 px, capturas reales de esa revisión, comprobación de iframes/servicios externos, revisión de cada integrante y publicación de los cambios aprobados. El acceso al navegador de pruebas no estuvo disponible en la sesión de preparación. No se presentan como realizadas esas pruebas. Ver [control de entrega](docs/ENTREGA.md).

Para publicar los archivos aprobados, subirlos a la rama que GitHub Pages tenga configurada. Si se usa publicación desde rama, la configuración habitual para este proyecto es `main` / raíz. La carpeta incluye `.nojekyll` y CSS compilado. Revisar la URL pública y sus subpáginas después del despliegue. La configuración de Pages debe confirmarla alguien con acceso a Settings del repositorio.

Los PDF y los Markdown de `docs/` se incluyen en Git mediante excepciones a `.gitignore`. `tmp/` y `node_modules/` quedan excluidos.
