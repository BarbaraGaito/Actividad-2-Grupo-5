# Control de entrega · Actividad 3

Versión local preparada el 02/11/2026. Este control distingue implementación de comprobaciones que requieren al grupo y al navegador.

| Consigna | Implementación o evidencia |
| --- | --- |
| HTML5, Tailwind, JavaScript | HTML semántico, CLI de Tailwind y `js/sitio.js`, sin frameworks frontend. |
| Inicio | Identidad, cinco temáticas, propuesta, mapa y recomendaciones. |
| Puntos de interés | 31 fichas individuales; cada integrante tiene su página temática. |
| Arte urbano original | Once fotos y textos de Lara. Fotografías y descripciones conservadas, con ubicaciones actualizadas en esta revisión. |
| Mapa | 31 ubicaciones, marcadores con filtros y selección de fichas; itinerarios por tema y comuna. |
| Contacto | Cuatro campos, errores asociados, validación y confirmación simulada. |
| Reserva | Cinco precios, 1-20 personas, fecha válida, adicional, total ARS, resumen, edición y confirmación simulada. |
| Conversión | No aplica: precios expresados en ARS. |
| API o FAQ | Chat funcional de preguntas frecuentes, diez FAQ con búsqueda y mapa con Leaflet/OpenStreetMap y enlaces a Google Maps. |
| UX y Gestalt | Justificación en Documento 1 y decisiones técnicas en Documento 2. |
| Accesibilidad | Etiquetas, alt, foco, teclado, errores y estados implementados; revisión manual pendiente. |
| Responsive | Estilos Mobile First implementados. Prueba visual en cuatro anchos y capturas reales pendientes. |
| Documentos | Dos PDF generables con contenido, fuentes, lógica y evidencia automatizada. El Documento 2 debe completarse con capturas reales antes de la entrega. |
| Repositorio público | Existente y verificado. Cambios de esta revisión todavía locales. |
| Colaboración | Responsabilidades confirmadas. Cada integrante debe realizar aportes verificables con su cuenta. |
| Sitio desplegado | Existe URL de GitHub Pages. Falta subir esta revisión aprobada y comprobarla públicamente. |
| Figma | Acceso verificado al archivo original. Los PDF explican las extensiones respecto de la Actividad 2; no se modificó ese archivo. |

## Recorrido de prueba manual

1. Abrir `http://localhost:8000` después de `npm start`.
2. En las herramientas del navegador probar 320, 390, 768 y 1440 px de ancho. Revisar inicio, las cinco temáticas, una ficha de cada una, mapa, contacto, reserva, FAQ y comunas.
3. Comprobar que no aparezca desplazamiento horizontal, texto cortado ni botones superpuestos. Ampliar texto o zoom a 200 %. Revisar la imagen completa de cada obra de arte urbano.
4. Recorrer con Tab, Shift+Tab, Enter, Espacio y Escape. Verificar foco visible, apertura/cierre del menú, regreso del foco y acceso a desplegables.
5. Enviar contacto vacío; corregir nombre, correo, motivo y mensaje. Confirmar que los errores se entiendan y el resultado diga que el envío es simulado.
6. Probar las cinco opciones de reserva. Ejemplo: fútbol, dos personas y guía impresa = ARS $ 30.000. Probar cantidades 0, 21, decimales y fecha pasada. Editar el resumen y comprobar que sea necesario revisarlo de nuevo.
7. Buscar `futbol` en FAQ, luego una palabra inexistente y limpiar la búsqueda. Abrir el chat, preguntar por precios y ubicaciones, usar preguntas sugeridas, limpiar la conversación y cerrarla con Escape. Comprobar el foco de regreso y que el presupuesto se conserve al abrir la reserva.
8. Elegir ubicaciones en el mapa, filtrar por temática y abrir las fichas e itinerarios. Revisar las once fotografías de arte urbano y sus ubicaciones.
9. Probar sin JavaScript: contenido, enlaces y desplegables siguen disponibles, mientras que los botones de simulación se deshabilitan.
10. Guardar capturas PNG reales en `docs/capturas/`: `inicio-390.png`, `inicio-1440.png`, `arte-390.png`, `arte-1440.png`, `reserva-390.png`, `reserva-768.png`, `reserva-1440.png`, `contacto-error-390.png`, `mapa-768.png`. Registrar navegador, tamaño, fecha y resultado.
11. Volver a generar los PDF con `py scripts/generar-documentos.py`; si existen capturas, se incorporan al Documento 2. No se deben usar capturas de Figma como evidencia de la web funcionando.
12. Después de publicar, repetir los enlaces principales desde GitHub Pages en una ventana privada y confirmar acceso a Figma sin permisos de edición.

## Enlaces para el espacio de entrega

- Sitio: https://barbaragaito.github.io/Actividad-2-Grupo-5/
- Repositorio: https://github.com/BarbaraGaito/Actividad-2-Grupo-5
- Prototipo original: https://www.figma.com/design/xHqN3NQfBRSYfUmpRroRao/Actividad-2-Grupo-5?node-id=0-1
- Design System implementado: https://barbaragaito.github.io/Actividad-2-Grupo-5/pantallas/design-system/index.html

El último enlace será público cuando se suban estos cambios. Los PDF explican las diferencias con el prototipo original. No se declara el cumplimiento total hasta completar las verificaciones pendientes.
