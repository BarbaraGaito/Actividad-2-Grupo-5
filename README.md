# Porteña · Buenos Aires, a pie y con tiempo

Actividad 3 · Grupo 5 · Diseño y Desarrollo Web. Profesora: Patricia Carina Litovicius.

Guía cultural para turistas y residentes que quieran explorar Buenos Aires mediante cinco recorridos temáticos: fútbol, arquitectura, gastronomía, arte urbano y cine.

## Enlaces

- [Repositorio grupal](https://github.com/BarbaraGaito/Actividad-2-Grupo-5)
- [Prototipo y Design System en Figma](https://www.figma.com/design/xHqN3NQfBRSYfUmpRroRao/Actividad-2-Grupo-5?node-id=0-1)
- [Dirección existente de GitHub Pages](https://barbaragaito.github.io/Actividad-2-Grupo-5/). Esta versión se encuentra en el checkout local: debe subirse y desplegarse para que esa dirección refleje los cambios.

## Ejecutar

Abrir `index.html` directamente, o ejecutar desde esta carpeta:

```sh
python3 -m http.server 8000
```

Visitar <http://localhost:8000>. El CSS de Tailwind, las fuentes y las imágenes están incluidos. No hace falta instalar dependencias para visualizarlo. El mapa y los enlaces externos necesitan internet.

Para modificar los estilos:

```sh
npm install
npm run build:css
# Durante la edición:
npm run watch:css
```

Tailwind CSS 3.4.17 está fijado en `package-lock.json`. Editar las clases HTML, `tailwind.config.js` y `css/entrada.css`; `css/styles.css` es el resultado compilado. Se utiliza la [CLI oficial de Tailwind 3](https://v3.tailwindcss.com/docs/installation).

## Funcionalidades

- Inicio, cinco recorridos temáticos y arquitectura por comunas.
- Comuna 1: Palacio Barolo, Pasaje Roverano y Teatro Colón. Comunas 2 y 3 tienen una página que informa el estado del contenido pendiente.
- Paradas desplegables con descripción e información práctica.
- Mapa incrustado, lista numerada y enlaces para abrir las ubicaciones en otra pestaña. Las referencias de zona y las ubicaciones pendientes se identifican expresamente.
- Contacto con validación nativa de HTML y confirmación simulada.
- Planificación con cinco opciones, cantidad de personas, fecha, guía impresa opcional, total automático en ARS, resumen editable y confirmación simulada.
- Preguntas frecuentes con búsqueda y respuestas desplegables: alternativa funcional elegida para el punto 3.6 de la consigna.
- Menú móvil, navegación mediante teclado, salto al contenido, foco visible y mensajes de estado. Impresión de las guías desde el navegador.

Los formularios no envían ni almacenan datos. No hay pagos ni reservas reales. Los precios son de práctica, están expresados en pesos argentinos y no requieren conversión de moneda.

## Tecnologías y fecha de corte

Se tomó el **27/10/2026**, de acuerdo con el cronograma de `consigna`.

Se utilizan HTML5 semántico y formularios; CSS, Flexbox, Grid y media queries; Tailwind CSS; variables, operadores, condicionales, funciones, DOM y eventos de JavaScript. La validación corresponde a atributos HTML: `required`, `type`, `min`, `max`, `step`, `minlength`, `maxlength` y `pattern`.

Las validaciones JavaScript previstas para el **29/10**, y JSON/consumo de APIs de la semana del **02/11**, quedan fuera de esta versión. No se utilizan `fetch`, JSON en el navegador, frameworks frontend, backend, base de datos ni almacenamiento de datos personales. La compilación de Tailwind es una herramienta de desarrollo; el navegador solo recibe HTML, CSS y JavaScript.

## Estructura

```text
index.html                         Inicio y entrada del sitio
pantallas/
  futbol/index.html                Fútbol
  gastronomia/index.html           Gastronomía
  arquitectura/
    index.html                     Guía por comunas
    comuna-1.html                  Fichas de arquitectura
    comuna-2.html / comuna-3.html   Contenido pendiente
  arte-urbano/index.html           Arte urbano
  cine/index.html                  Cine
  mapa/index.html                  Mapa y paradas
  contacto/index.html              Contacto simulado
  reserva/index.html               Planificación y precios
  preguntas-frecuentes/index.html  Ayuda con búsqueda
  sobre-la-guia/index.html         Proyecto y equipo
css/entrada.css                    Entrada de Tailwind y componentes
css/styles.css                     CSS compilado
css/fuentes.css                    Fuentes locales
js/sitio.js                        DOM e interacciones
img/inicio/                        Imágenes de la página principal
img/futbol/                        Recursos de Fútbol
img/gastronomia/                   Recursos de Gastronomía
img/arquitectura/                  Recursos de Arquitectura y comunas
img/arte-urbano/                   Recursos de Arte urbano
img/cine/                          Recursos de Cine
img/compartidas/                   Logos, flechas y separadores comunes
img/fuentes/                       Tipografías y licencias SIL OFL
tailwind.config.js                 Paleta y configuración
documentacion/                     Documentos y capturas locales
```

Las páginas contienen su contenido completo en HTML. El script compartido añade las interacciones; no se requiere un router ni compilar JavaScript. Sin JavaScript se mantienen los contenidos, la navegación, el mapa por enlaces y los desplegables; se informa que las simulaciones requieren activarlo.

Las vistas están agrupadas por temática dentro de `pantallas/`. Sus enlaces y recursos utilizan rutas relativas, por lo que también se pueden abrir directamente desde sus subcarpetas. Tailwind incluye todas las vistas de `pantallas/` al compilar los estilos.

## Servicios y recursos

- Google Maps mediante `iframe` y enlaces; sin API programada ni clave.
- Preguntas frecuentes locales mediante HTML, DOM y eventos.
- Pantallas y recursos obtenidos del MCP oficial de Figma. Todos los recursos visuales se sirven localmente, sin URLs temporales de assets.
- Lora, DM Sans y Manrope locales, con las licencias SIL OFL incluidas en `img/fuentes/`.
- Enlaces de consulta a [Palacio Barolo Tours](https://palaciobarolotours.com.ar/informacion-relevante-para-los-visitantes/) y al [Teatro Colón](https://teatrocolon.org.ar/). Los horarios de visita deben consultarse antes de salir.

La autoría y las licencias de publicación de las fotografías se deben confirmar con el grupo antes del despliegue público. El origen verificable de estos archivos es el prototipo compartido; no se atribuye una licencia que no fue proporcionada.

## Review y entrega

Se verificaron las 14 páginas en Chrome a 320, 390, 768 y 1440 px, los enlaces internos, la carga de imágenes y fuentes, el menú móvil, los formularios, las cinco tarifas y sus adicionales, las fechas, la edición del resumen, la búsqueda de preguntas y la navegación sin JavaScript. La compilación de Tailwind y la revisión sintáctica del JavaScript finalizaron correctamente. También se comprobó la carga visual del mapa externo.

Por indicación del usuario, se conservan “Lugar 1” a “Lugar 5” y las paradas sin dirección. No se inventaron nombres ni coordenadas. También quedan pendientes las fotografías originales, la autoría de las fichas y los contenidos de Comunas 2 y 3. Las diferencias entre el contenido móvil antiguo y el escritorio se resolvieron manteniendo el contenido de escritorio en todos los tamaños.

Los contadores de inicio y cine se adaptaron al contenido disponible; no se anuncian audios que el proyecto todavía no incorpora. Se agregaron las páginas y los accesos necesarios para la Actividad 3.

Antes de entregar: revisar contenidos, confirmar derechos de recursos, completar aportes individuales, subir los cambios y comprobar GitHub Pages. En esta sesión no se crean commits ni se publica el sitio.

Los PDF y las carpetas `assets/` están excluidos por `.gitignore`. Los archivos de `img/` son recursos del sitio y se incluyen para que funcione al clonar el repositorio. Se respetaron las reglas locales existentes para `*.md` y `*.tex`; este README ya estaba versionado.

## Integrantes

| Integrante | Legajo | Contribuciones |
| --- | --- | --- |
| Aldana Nicolas | 1217752 | Completar con su aporte real. |
| Alonso Lara Trinidad | 1155144 | Completar con su aporte real. |
| Gaito Barbara Denise | 1155822 | Completar con su aporte real. |
| Gonzalez Homero Ivan | 1153714 | Completar con su aporte real. |
| Martinez Pilar | 1203885 | Completar con su aporte real. |

No se atribuyeron tareas ni commits a integrantes sin evidencia de sus contribuciones.
