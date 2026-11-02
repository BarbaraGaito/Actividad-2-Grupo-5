# Evidencia de pruebas

Ejecución sobre la versión local preparada para revisión del Grupo 5.

| Comprobación | Resultado |
| --- | --- |
| `npm run build` | Correcto: generación del contenido y compilación de Tailwind. |
| `npm test` | 25 pruebas aprobadas, 0 fallos. |
| HTML recorrido por la prueba estructural | 38 páginas. |
| Tarifas y adicionales | Cinco tarifas × dos límites de cantidad × dos estados del adicional: veinte combinaciones correctas. |
| Arte urbano | Once fotos idénticas al original, verificadas contra sus hashes Git; once descripciones y alt conservados; ubicaciones actualizadas según la revisión del grupo. |
| HTTP local | Respuesta 200 de inicio, arte urbano, contacto, reserva y ambos PDF. |
| Sintaxis JavaScript y espacios del diff | Sin errores; solo aviso de normalización LF/CRLF de Git. |
| PDF | Ambos reabiertos, texto extraíble y todas las páginas renderizadas e inspeccionadas visualmente. |

Las otras pruebas comprueban la validación de contacto, errores y corrección, límites y fecha de reserva, resumen editable y limpieza, preselección de temática, búsqueda FAQ, menú/Escape/foco, selección del mapa e impresión de fichas. Además se comprueban siete casos de chat, cuatro casos del mapa con la biblioteca real de Leaflet en DOM y dos comprobaciones matemáticas de contraste.

## Límites

No hubo acceso al navegador de automatización. No se ejecutaron comprobaciones visuales del sitio a 320, 390, 768 o 1440 px, ni se tomaron capturas reales. Tampoco se declara una auditoría de lector de pantalla, certificación WCAG ni una prueba visual de la carga de iframes. jsdom valida el DOM y la lógica, no la composición CSS.

La comprobación local HTTP no demuestra que la revisión esté desplegada. Los cambios permanecen sin commits y sin publicar para que el grupo decida cuándo subirlos. El control manual y los nombres de capturas previstos están en `docs/ENTREGA.md`.
