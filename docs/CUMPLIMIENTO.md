# Revisión de la consigna · Actividad 3

Revisión del 02/11/2026. Se distingue la implementación de la verificación visual que todavía requiere navegador.

| Requisito | Evidencia y estado |
| --- | --- |
| HTML5 | Páginas semánticas con `header`, `nav`, `main`, `section`, `article`, `footer`, formularios y un `h1` por página. Comprobado en 46 HTML. |
| Tailwind CSS obligatorio | Configuración, entrada y CSS compilado incluidos. No hay Bootstrap ni otro framework de estilos. Leaflet aporta únicamente los estilos técnicos del mapa. |
| JavaScript sin React/Angular/Vue | Scripts propios para DOM, eventos, validación, cálculo, mapa, búsqueda y chat. Sin frameworks frontend. |
| Identidad de Actividad 2 | Logo, paleta, composición editorial, cinco temáticas, botones y tipografías compartidas. Design System HTML y PDF explican las extensiones. La comparación visual final está pendiente. |
| Inicio: nombre y logo | Marca Porteña y recurso gráfico con enlace al inicio. |
| Inicio: presentación, objetivo y valor | Propuesta de exploración cultural, cinco intereses, contenido representativo y recomendaciones. |
| Inicio: accesos | Cinco tarjetas temáticas, navegación, mapa, planificación, contacto y ayuda. |
| Inicio: mapa general | Marcadores simultáneos y filtro por temática. Sin JavaScript se conserva el mapa de respaldo. |
| Página de cada integrante | Arquitectura/Homero, Arte urbano/Lara, Gastronomía/Bárbara, Fútbol/Pilar y Cine/Nicolás. |
| Puntos: nombre y descripción | 31 fichas individuales, con títulos y contenido. |
| Puntos: imágenes y alt | Fotografías temáticas del grupo; las once obras de Lara tienen su imagen original completa y alt original. No se atribuye una foto temática a un edificio que no representa. |
| Puntos: actividades y datos prácticos | Actividad, duración orientativa, acceso, horarios o consulta al establecimiento, recomendaciones y fuentes. |
| Puntos: ubicación | Lugar, barrio o establecimiento de cada fotografía, con mapa. Plaza del Congreso e Hospitales se incorporaron según indicación de la autora. |
| Puntos: navegación coherente | Inicio, temática, ficha anterior/siguiente y planificación; componentes comunes. |
| Mapa del recorrido | 31 fichas con coordenadas y marcadores: veinte paradas culturales y once fotos de arte urbano. Filtros por temática, vista inicial en CABA y opción para incluir todos los puntos. |
| Mapa: orden | Numeración por temática/comuna; itinerarios externos para consultar el trayecto real. El mapa no presenta una línea recta como si fuera un camino peatonal. |
| Contacto: cuatro campos | Nombre, correo, motivo y mensaje con etiquetas asociadas. |
| Contacto: validación | Obligatorios, correo válido y límites de longitud; errores textuales asociados y foco en el primero. |
| Contacto: resultado funcional | Confirmación simulada explícita, sin transmisión ni almacenamiento. |
| Reserva: opción y cantidad | Cinco temáticas y entre 1 y 20 personas. Fecha válida, nombre y correo. |
| Reserva: precio y adicionales | Precio por persona y guía impresa opcional por persona. |
| Reserva: importe automático | `(precio unitario + adicional por persona) × personas`. Comprobado con las cinco tarifas. |
| Reserva: moneda | Todos los importes están en ARS. La conversión solo se exige si se utiliza moneda extranjera; aquí no corresponde. |
| Reserva: resumen previo | Opción, fecha, cantidad, adicional y total antes de confirmar. |
| Reserva: control y resultado | Editar, limpiar, invalidar resúmenes anteriores y confirmación de simulación sin cobros. |
| Chat de preguntas frecuentes | Chat funcional en las 46 páginas: entrada libre, respuestas relacionadas, preguntas sugeridas, enlaces, cálculo de importes y recuperación de consultas sin respuesta. |
| Chat: naturaleza | Bot local de respuestas preparadas y reglas; no es IA generativa. Las consultas no se transmiten ni se almacenan. La lista de diez FAQ también sigue disponible. |
| Nielsen | Las diez heurísticas se justifican en Documento 1 y se relacionan con decisiones técnicas en Documento 2. |
| Gestalt | Proximidad, semejanza, región común, figura/fondo y continuidad aplicadas y justificadas en Documento 1. |
| Accesibilidad: contraste | Combinaciones principales de texto ≥ 4,5:1. Foco ≥ 3:1 en sus fondos previstos. Se corrigió el foco sobre acentos de color. Falta revisar el resultado visual real. |
| Accesibilidad: encabezados y alt | Idioma, encabezados, imágenes y etiquetas revisados automáticamente. |
| Accesibilidad: teclado | Menú, formularios, desplegables, chat, filtros y marcadores tienen controles de teclado. Escape cierra menú/chat y restaura el foco. Verificación en navegador pendiente. |
| Accesibilidad: mensajes | Estados anunciados, errores textuales, foco, etiquetas y referencias asociadas. El color se acompaña de texto, nombres o números. |
| Responsive Mobile First | Base de una columna, variantes `md`/`lg`/`xl`, mapas/fotos flexibles y chat limitado al viewport. Implementado; comprobación visual y capturas reales pendientes. |
| Pruebas | `npm test`: HTML, formularios, cálculos, FAQ, chat, mapa real de Leaflet en DOM, fuentes originales y contraste matemático. No sustituye una prueba visual del navegador. |

## Justificación de bibliotecas y servicios

Leaflet 1.9.4 es una biblioteca de mapas JavaScript. Permite dibujar marcadores, abrir fichas y filtrar por temática; no reemplaza HTML, Tailwind ni el JavaScript de las interacciones. Se sirve desde `vendor/leaflet/`, con licencia BSD de dos cláusulas e integridad verificada contra los hashes oficiales.

El fondo cartográfico usa OpenStreetMap con atribución visible. La API pública de USIG se utilizó para normalizar direcciones y guardar coordenadas en `datos/ubicaciones.json`. Se completaron Santa Clara del Mar con Georef y FADU con su mapa institucional. Estas consultas no se ejecutan en cada visita ni reciben datos personales. Se conservan los enlaces de Google Maps para itinerarios y ubicaciones. La web sigue ofreciendo direcciones y enlaces si falla el mapa.

## Lo que falta comprobar para afirmar cumplimiento completo

La herramienta de navegador sigue sin estar disponible. No se afirma que se hayan revisado visualmente los anchos de 320, 390, 768 y 1440 px, el zoom, la carga real de teselas/iframes, ni el uso con un lector de pantalla. La lista de revisión está en `docs/ENTREGA.md`.

Los cambios permanecen locales para que el grupo los revise antes de subirlos. La contribución efectiva de cada integrante y el despliegue final se comprueban en GitHub; no pueden reemplazarse por atribuciones o commits ficticios.
