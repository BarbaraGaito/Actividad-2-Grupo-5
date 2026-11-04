# Porteña · Buenos Aires, a pie y con tiempo

Proyecto grupal de la Actividad 3 · Grupo 5 · Diseño y Desarrollo Web (UADE) · Profesora Patricia Carina Litovicius.

## Objetivo y público

Porteña es una guía de recorridos culturales por la Ciudad de Buenos Aires. Su objetivo es ayudar a elegir qué conocer y a organizar la visita con información práctica, fotografías y la ubicación de cada lugar.

Está pensada para turistas nacionales e internacionales y para residentes que quieren descubrir la ciudad desde otro punto de vista. El contenido está en español y se puede leer cómodamente desde el celular.

## Enlaces

- Sitio publicado: <https://barbaragaito.github.io/Actividad-2-Grupo-5/>
- Repositorio: <https://github.com/BarbaraGaito/Actividad-2-Grupo-5>
- Diseño y prototipo de la Actividad 2 (Figma): <https://www.figma.com/design/xHqN3NQfBRSYfUmpRroRao/Actividad-2-Grupo-5?node-id=0-1>
- Design System de la versión implementada: <https://barbaragaito.github.io/Actividad-2-Grupo-5/pantallas/design-system/index.html> ([archivo local](pantallas/design-system/index.html))
- Documento 1, diseño y contenido: [output/pdf/01-diseno-contenido.pdf](output/pdf/01-diseno-contenido.pdf)
- Documento 2, desarrollo e implementación: [output/pdf/02-desarrollo-implementacion.pdf](output/pdf/02-desarrollo-implementacion.pdf)
- Registro de pruebas funcionales: [docs/PRUEBAS.md](docs/PRUEBAS.md) · capturas en [docs/capturas/](docs/capturas/)

## Temáticas

| Temática | Responsable | Contenido |
| --- | --- | --- |
| Fútbol | Martinez Pilar | La Bombonera, Estadio Monumental y Café El Banderín. |
| Arquitectura | Gonzalez Homero Ivan | Nueve lugares en las comunas 1 y 13; ocho tienen fotografía. |
| Gastronomía | Gaito Bárbara Denise | Petricor, Enitma y Magari, de la galería *Cafeterías en CABA* (Tarea 1). |
| Arte urbano | Alonso Lara Trinidad | Cinco obras de *Paredes que Hablan* (Actividad 1). |
| Cine | Aldana Nicolas | Cine Gaumont, Sala Leopoldo Lugones y Librería Hernández. |

## Funcionalidades

- **Inicio** con la propuesta, acceso a las cinco temáticas, mapa general y consejos para el recorrido.
- **23 fichas individuales** (3 + 9 + 3 + 5 + 3) con descripción, actividad, duración orientativa, horarios, acceso, fotografía, mapa y fuente. Cada ficha enlaza con la anterior, la siguiente, su temática y la reserva.
- **Mapa interactivo** con Leaflet y OpenStreetMap: 23 puntos con el color y el número de su temática, filtro por temática, botón para ver todos, zoom y ventanas con enlace a cada ficha. Si el fondo cartográfico no carga, se muestra un aviso y los marcadores siguen disponibles.
- **Contacto** con nombre, correo, motivo y mensaje. Valida campos vacíos o con solo espacios y el formato del correo, y muestra los errores junto a cada campo. La confirmación es simulada.
- **Reserva** con las cinco temáticas, de 1 a 20 personas, fecha desde hoy, guía impresa opcional, precio unitario, total automático, resumen editable y confirmación simulada.
- **Chat de preguntas frecuentes** en todas las páginas, con respuestas programadas a partir del contenido del sitio (no usa IA generativa). Calcula presupuestos con los mismos precios de la reserva y, cuando no reconoce una consulta, lo dice y ofrece las preguntas frecuentes y el contacto. Se abre y cierra con teclado (Escape devuelve el foco).
- **Preguntas frecuentes** con diez respuestas y búsqueda que no distingue tildes ni mayúsculas.
- **Accesibilidad**: salto al contenido, foco visible, menú mobile con `aria-expanded`, errores con `aria-invalid` y `aria-describedby`, mensajes con `role="status"`, textos alternativos y un único `h1` por página.

Los formularios no envían ni guardan datos y no hay pagos: son simulaciones para la actividad.

## Precios (ARS)

| Temática | Precio por persona |
| --- | ---: |
| Fútbol | $ 12.000 |
| Arquitectura | $ 10.000 |
| Gastronomía | $ 15.000 |
| Arte urbano | $ 9.000 |
| Cine | $ 11.000 |
| Guía impresa (adicional) | $ 3.000 por persona |

`Total = (precio unitario + adicional por persona) × cantidad de personas`

Ejemplo: Fútbol, 2 personas, con guía impresa → (12.000 + 3.000) × 2 = ARS $ 30.000. Todos los importes están en pesos argentinos, así que no hay conversión de moneda.

## Tecnologías

- HTML5 semántico.
- Tailwind CSS 3.4.17, compilado con su CLI. El CSS compilado (`css/styles.css`) está incluido en el repositorio.
- JavaScript del navegador, sin frameworks (no se usan React, Angular, Vue ni Bootstrap).
- Leaflet 1.9.4 (incluido en `vendor/leaflet/`, licencia BSD) con el fondo cartográfico de OpenStreetMap.
- Node.js solo para desarrollo: servidor local y generación de los datos del chat y del mapa (con jsdom).
- Tipografías Lora, DM Sans y Manrope alojadas en el proyecto (licencia SIL OFL).
- Íconos: SVG propios de trazo simple (`scripts/iconos.cjs`), sin bibliotecas de íconos.

## Integraciones externas

| Servicio | Uso |
| --- | --- |
| OpenStreetMap | Fondo del mapa interactivo, con atribución visible. |
| USIG (Gobierno de la Ciudad) | Se consultó una vez para obtener las coordenadas de las direcciones; se guardan en `datos/ubicaciones.json`. No se consulta al visitar el sitio. |
| Google Maps | Mapa incrustado y enlace en cada ficha; itinerarios por temática. |

## Estructura de carpetas

```text
index.html                     Inicio
pantallas/
  futbol/ gastronomia/ cine/   Páginas temáticas
  arte-urbano/                 Galería de cinco obras
  arquitectura/                Índice, comuna-1.html y comuna-13.html
  puntos/                      23 fichas individuales
  mapa/                        Mapa interactivo y listado de paradas
  contacto/ reserva/           Formularios
  preguntas-frecuentes/        Diez preguntas con búsqueda
  sobre-la-guia/               Propuesta y equipo
  design-system/               Design System implementado
css/entrada.css                Tailwind y componentes compartidos
css/styles.css                 CSS compilado
css/fuentes.css                Declaración de las tipografías locales
js/sitio.js                    Menú, validaciones, reserva, búsqueda de FAQ
js/chat.js                     Chat de preguntas frecuentes
js/mapa.js                     Mapa con Leaflet y filtros
js/contenido-ayuda.js          Datos del chat (generado)
js/contenido-mapa.js           Datos del mapa (generado)
datos/recorridos.json          Contenido de las 23 fichas, precios y equipo
datos/ubicaciones.json         Coordenadas (USIG)
datos/arte-actividad-1.json    Textos originales de arte urbano
datos/origen-fotografias-arte.json  Origen de las fotos de arte urbano
img/                           Fotografías, logo y tipografías
vendor/leaflet/                Leaflet y su licencia
scripts/                       Servidor local, generación de datos, íconos y geocodificación
docs/                          Registro de pruebas y capturas
output/pdf/                    Documentos 1 y 2
```

## Cómo ejecutar el proyecto

Con Node.js instalado:

```sh
npm start
```

y abrir <http://localhost:8000>. Para ver el sitio no hace falta instalar dependencias, porque el CSS y los datos ya están compilados. El mapa necesita internet para cargar el fondo de OpenStreetMap; si se abre `index.html` directamente como archivo, OpenStreetMap rechaza el fondo y el sitio muestra un aviso.

Para modificar estilos o contenido:

```sh
npm ci
npm run build        # regenera los datos del chat y del mapa y el CSS
npm run watch:css    # recompila el CSS mientras se edita
```

Las fichas se editan en su HTML. Si se cambia `datos/recorridos.json` o las preguntas frecuentes, hay que ejecutar `npm run build:content`, porque el chat y el mapa leen esos datos. Un cambio en una ficha debe hacerse en los dos lugares.

## Publicación en GitHub Pages

El sitio usa rutas relativas y funciona dentro del subdirectorio `/Actividad-2-Grupo-5/`. Incluye `.nojekyll`, el CSS compilado, Leaflet y las tipografías, así que no requiere ningún paso de compilación en GitHub. Se publica desde la rama `main` (raíz).

Al 3/11/2026 la versión publicada coincide con el commit `bb45e96`. Las correcciones de la revisión final (registradas en el Documento 2 y en `docs/PRUEBAS.md`) están en la copia local y se publican al subir los cambios a `main`. Después de publicarlas conviene recorrer el sitio publicado en una ventana privada.

## Integrantes y contribuciones

| Integrante | Legajo | Temática | Aportes registrados en GitHub |
| --- | --- | --- | --- |
| Aldana Nicolas | 1217752 | Cine | Fotografías de las fichas de cine y sus textos alternativos (PR #1 a #4). |
| Alonso Lara Trinidad | 1155144 | Arte urbano | Fotografías y textos de arte urbano, chat de preguntas frecuentes y mapa interactivo (commit “chat y mejoras”). |
| Gaito Bárbara Denise | 1155822 | Gastronomía | Creación del repositorio, fichas de gastronomía con fotos de su Tarea 1, ajustes generales de las fichas y documentación. |
| Gonzalez Homero Ivan | 1153714 | Arquitectura | Primera versión de la Actividad 3, guía de arquitectura por comunas 1 y 13 con ocho fotografías. |
| Martinez Pilar | 1203885 | Fútbol | Recorrido de fútbol actualizado con el Estadio Monumental y sus fotografías. |

El detalle de cada aporte se puede consultar en el historial de commits del repositorio.

## Imágenes y recursos

- Arte urbano: fotografías de Lara Trinidad Alonso, idénticas a las de su repositorio de la Actividad 1 ([Paredes que Hablan](https://github.com/Larialonso/Disenoydesarrolloweb/tree/main/Paredes-que-hablan)).
- Gastronomía (tres paradas): fotografías de Bárbara Gaito, idénticas a las de su [Tarea 1](https://github.com/BarbaraGaito/Tarea-1-Gaito).
- Arquitectura, cine y fútbol: fotografías aportadas al repositorio por Homero, Nicolás y Pilar.
- Las imágenes de portada `img/inicio/Inicio-2.jpeg`, `img/futbol/Futbol-2.jpeg`, `img/cine/Cine-1.jpeg`, `img/cine/Cine-2.jpeg`, `img/gastronomia/Gastronomia-4.jpeg` y `img/gastronomia/Gastronomia-5.jpeg` vienen del prototipo de la Actividad 2 y su origen no está documentado en el repositorio.
- Leaflet (BSD), tipografías (SIL OFL), cartografía de OpenStreetMap y coordenadas de USIG, con sus licencias o atribuciones.
