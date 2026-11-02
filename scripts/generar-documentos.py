"""Genera los dos PDF de Actividad 3 y el inventario de recursos.
Dependencias: reportlab, pypdf, pymupdf, pillow.
Ejecutar desde la raíz: py scripts/generar-documentos.py
Las capturas reales opcionales se leen de docs/capturas/*.png.
"""
from pathlib import Path
import sys
import json
import re
from html import escape

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'tmp/python-deps'))
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle, Image, KeepTogether
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.colors import HexColor, white
from reportlab.lib.enums import TA_LEFT
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.pagesizes import A4
from reportlab.graphics.shapes import Drawing, Rect, Line, String
from PIL import Image as PILImage, ImageOps, ImageDraw
from pypdf import PdfReader
import pymupdf

OUT = ROOT / 'output/pdf'
TMP = ROOT / 'tmp/pdfs'
OUT.mkdir(parents=True, exist_ok=True)
TMP.mkdir(parents=True, exist_ok=True)
(ROOT / 'docs/capturas').mkdir(parents=True, exist_ok=True)
DATA = json.loads((ROOT / 'datos/recorridos.json').read_text(encoding='utf-8'))
ARTE = json.loads((ROOT / 'datos/arte-actividad-1.json').read_text(encoding='utf-8'))
DATA['recorridos'][3]['puntos'] = ARTE['puntos']
FIGMA = 'https://www.figma.com/design/xHqN3NQfBRSYfUmpRroRao/Actividad-2-Grupo-5?node-id=0-1'
SITE = 'https://barbaragaito.github.io/Actividad-2-Grupo-5/'
REPO = 'https://github.com/BarbaraGaito/Actividad-2-Grupo-5'

for name, file in [('DM','dm-sans-400.ttf'),('DM-Bold','dm-sans-700.ttf'),('Lora','lora-400.ttf')]:
    pdfmetrics.registerFont(TTFont(name,str(ROOT / 'img/fuentes' / file)))
pdfmetrics.registerFontFamily('DM',normal='DM',bold='DM-Bold',italic='DM',boldItalic='DM-Bold')
INK = HexColor('#171714')
PAPER = HexColor('#fffef8')
SAND = HexColor('#f3f0e8')
LIME = HexColor('#e9ff48')
BLUE = HexColor('#2454bb')
W,H = A4
CW = W-96
styles = {
    'body': ParagraphStyle('body',fontName='DM',fontSize=10,leading=15,textColor=INK,spaceAfter=8),
    'small': ParagraphStyle('small',fontName='DM',fontSize=8.5,leading=12,textColor=INK,spaceAfter=6),
    'h1': ParagraphStyle('h1',fontName='Lora',fontSize=27,leading=33,textColor=INK,spaceAfter=20),
    'h2': ParagraphStyle('h2',fontName='Lora',fontSize=18,leading=23,textColor=INK,spaceBefore=12,spaceAfter=10,keepWithNext=True),
    'h3': ParagraphStyle('h3',fontName='DM-Bold',fontSize=11,leading=16,textColor=INK,spaceBefore=9,spaceAfter=6,keepWithNext=True),
    'tag': ParagraphStyle('tag',fontName='DM-Bold',fontSize=9,leading=13,textColor=INK,spaceAfter=12),
    'cover': ParagraphStyle('cover',fontName='Lora',fontSize=58,leading=66,textColor=INK,spaceAfter=20),
}
def p(text, kind='body'):
    return Paragraph(text, styles[kind])
def esc(text):
    return escape(str(text))
def link(url, title):
    return f'<link href="{escape(url,quote=True)}" color="#2454bb"><u>{esc(title)}</u></link>'
def table(rows, widths=None):
    cells=[[p(esc(c),'small') for c in row] for row in rows]
    t=Table(cells,colWidths=widths or [CW/len(rows[0])]*len(rows[0]),hAlign='LEFT',repeatRows=1)
    t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),LIME),('ROWBACKGROUNDS',(0,1),(-1,-1),[white,SAND]),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),9),('RIGHTPADDING',(0,0),(-1,-1),9),('TOPPADDING',(0,0),(-1,-1),8),('BOTTOMPADDING',(0,0),(-1,-1),8),('LINEBELOW',(0,-1),(-1,-1),0.5,HexColor('#cbc6b8'))]))
    return t
def photo(file,maxw=CW,maxh=240):
    with PILImage.open(ROOT/file) as im: iw,ih=im.size
    ratio=min(maxw/iw,maxh/ih)
    return Image(str(ROOT/file),width=iw*ratio,height=ih*ratio,hAlign='LEFT')
def page(story, title, tag=None):
    if story: story.append(PageBreak())
    if tag: story.append(p(esc(tag.upper()),'tag'))
    story.append(p(esc(title),'h1'))
def footer(c,doc):
    c.saveState()
    c.setFillColor(PAPER); c.rect(0,0,W,H,fill=1,stroke=0)
    c.setStrokeColor(HexColor('#cbc6b8'));c.line(48,43,W-48,43)
    c.setFont('DM',8);c.setFillColor(INK)
    c.drawString(48,29,'PORTEÑA / GRUPO 5 / ACTIVIDAD 3')
    c.drawRightString(W-48,29,f'{doc.page}')
    if doc.page>1:
        c.setFont('DM',8); c.drawString(48,H-33,'DISEÑO Y DESARROLLO WEB · 02/11/2026')
    c.restoreState()
def build(name,title,story):
    doc=SimpleDocTemplate(str(OUT/name),pagesize=A4,rightMargin=48,leftMargin=48,topMargin=58,bottomMargin=59,title=title,author='Grupo 5 - Porteña',subject='Actividad 3 - Diseño y Desarrollo Web')
    doc.build(story,onFirstPage=footer,onLaterPages=footer)
def cover(story, number, title):
    story.extend([Spacer(1,28),p(f'ACTIVIDAD 3 / DOCUMENTO {number}','tag'),p('Porteña','cover'),p(title,'h1'),p('Buenos Aires, a pie y con tiempo.'),Spacer(1,14),p('Materia: Diseño y Desarrollo Web<br/>Profesora: Patricia Carina Litovicius<br/>Modalidad grupal · Grupo 5<br/>Fecha de revisión: 2 de noviembre de 2026'),Spacer(1,14)])
    story.append(table([['Integrante','Legajo','Temática']]+[[e['nombre'],e['legajo'],e['tema']] for e in DATA['equipo']], [CW*.49,CW*.18,CW*.33]))
    story.extend([Spacer(1,20),p('Versión local para revisión del grupo','h2'),p('Los cambios de esta revisión todavía no se publicaron. La prueba visual en navegador y las capturas responsive reales deben completarse antes de presentar la entrega. Esta advertencia identifica el estado de revisión y no forma parte de la interfaz del visitante.','small')])

def sitemap():
    d=Drawing(CW,180)
    def box(x,y,w,title,color='#f3f0e8'):
        d.add(Rect(x,y,w,32,rx=6,ry=6,fillColor=HexColor(color),strokeColor=HexColor('#cbc6b8')))
        d.add(String(x+w/2,y+12,title,fontName='DM',fontSize=8,textAnchor='middle',fillColor=INK))
    box(CW/2-50,144,100,'INICIO','#e9ff48')
    d.add(Line(CW/2,144,CW/2,128,strokeColor=INK)); d.add(Line(45,128,CW-45,128,strokeColor=INK))
    for i,r in enumerate(DATA['recorridos']):
        x=i*(CW/5)+3
        d.add(Line(x+CW/10-3,128,x+CW/10-3,112,strokeColor=INK))
        box(x,80,CW/5-6,r['nombre'],r['color'])
    box(0,12,CW*.31,'31 fichas individuales')
    box(CW*.345,12,CW*.31,'Comunas 1, 2 y 3')
    box(CW*.69,12,CW*.31,'Mapa, contacto y reserva')
    return d

s=[]
cover(s,1,'Diseño y contenido')
page(s,'Una ciudad, muchas miradas','1 / Presentación y arquitectura')
s.extend([p('Porteña reúne cinco modos de explorar la cultura de Buenos Aires: fútbol, arquitectura, gastronomía, arte urbano y cine. Su objetivo es ofrecer información, imágenes y referencias prácticas que ayuden al visitante a elegir qué conocer y cómo organizar su experiencia.'),p('Público destinatario','h2'),p('Turistas nacionales e internacionales y residentes interesados en descubrir nuevas perspectivas de la ciudad. El contenido está escrito en español. Se prioriza una lectura clara desde el celular, con opciones para ampliar información y organizar una visita sin exigir una reserva.'),p('Propuesta de valor','h2'),p('Una identidad compartida conecta intereses distintos. El visitante puede entrar por una temática, abrir fichas, consultar ubicaciones y volver al recorrido. Las reservas y el contacto se simulan sin pagos ni almacenamiento de datos.'),sitemap(),p('La navegación transversal incluye chat de preguntas frecuentes, FAQ, Sobre la guía y Design System. Cada ficha conserva enlaces a la temática y a la ficha anterior/siguiente. Arquitectura se organiza por comunas; arte urbano incorpora la galería completa de la Actividad 1.'),p('Mapa del usuario','h2'),p('Inicio → elegir temática → explorar imágenes y fichas → consultar ubicación o referencia → planificar → revisar resumen → confirmar simulación. Contacto y FAQ están disponibles desde los pies de página.')])
page(s,'Una identidad que conecta','2 / Design System')
palette=[['Token','Valor','Aplicación'],['Tinta','#171714','Textos, cabeceras y botones'],['Papel','#FFFEF8','Fondo principal'],['Arena','#F3F0E8','Tarjetas'],['Borde','#CBC6B8','Separadores'],['Inicio','#E9FF48','Acento general']]+[[r['nombre'],r['color'].upper(),'Acento de temática'] for r in DATA['recorridos']]
s.extend([table(palette,[110,90,CW-200]),p('Tipografía y componentes','h2'),p('Se conserva el carácter editorial del diseño. Lora se utiliza en títulos; DM Sans en texto general y Manrope en algunas páginas temáticas. Georgia y Arial funcionan como alternativas. La Actividad 2 documentaba Georgia/Arial; la implementación usa fuentes locales equivalentes en intención y documenta el ajuste.'),p('Los títulos h1 van de 42 a 72 px según el ancho. Texto base de 16 px e interlineado amplio. Contenedor máximo de 1440 px; márgenes de 20, 40 y 80 px. Tarjetas de radio 16 px, botones de al menos 48 px y enlaces subrayados. El foco tiene un contorno visible; sobre fondos oscuros usa lima.'),p(link(FIGMA,'Figma: prototipo y diseño original de la Actividad 2')),p(link(SITE+'pantallas/design-system/index.html','Design System actualizado en HTML: versión implementada')),p('El Design System HTML se publicará con esta revisión. Documenta colores, tipografía, espaciado, botones, desplegables y estados de error. El Figma original no se modificó; las extensiones se explican en este documento.','small')])
page(s,'Páginas, contenido y evolución','3 / Estructura definitiva')
s.append(table([['Página','Estructura y contenido'],['Inicio','Marca y navegación; presentación e imagen; cinco accesos temáticos; mapa; recomendaciones; pie.'],['Temáticas','Cabecera editorial; contexto; paradas o galería; recomendaciones; mapa y planificación.'],['Arquitectura','Índice por comunas; comunas 1, 2 y 3; siete fichas y referencias.'],['Arte urbano','Once imágenes originales; títulos, ubicaciones/contextos y descripciones de la Actividad 1 de Lara.'],['Ficha individual','Nombre, descripción, imagen, actividad, acceso, duración, horarios, mapa cuando corresponde y enlaces entre fichas.'],['Mapa','Mapa con 31 ubicaciones y filtros; marcadores, listado numerado e itinerarios por tema/comuna.'],['Contacto','Nombre, correo, motivo y mensaje; validación y resultado simulado.'],['Reserva','Cinco opciones, cantidad, fecha, adicional, importe ARS, resumen editable y confirmación.'],['FAQ y equipo','Chat de preguntas frecuentes, diez respuestas buscables; equipo y responsabilidades.']],[100,CW-100]))
s.extend([p('Cambios respecto de la Actividad 2','h2'),p('Se conservaron la paleta, el logo, la composición editorial y las cinco temáticas. Se completaron las comunas 2/3 y se incorporaron fichas individuales, mapa, contacto, reserva, FAQ y estados de interacción. Los lugares genéricos de gastronomía y fútbol se concretaron con establecimientos y fuentes de consulta. Se retiraron contadores y duraciones que no correspondían al contenido disponible.'),p('En arte urbano se respeta la Actividad 1: once fotografías y descripciones originales, sin sustituirlas por otra selección. Las ubicaciones se completaron en la revisión del grupo: Plaza del Congreso para las dos marchas, Hospitales para Realidades poco frecuentes y lugares, barrios o establecimientos para las otras fotografías. La Scaloneta se conserva en Santa Clara del Mar.')])
page(s,'Decisiones centradas en el visitante','4 / Usabilidad y Gestalt')
nielsen=[('Visibilidad del estado','Total actualizado, menú expandido/contraído, errores junto a campos y resultado anunciado.'),('Lenguaje del mundo real','Recorridos, personas, fecha y precios en pesos argentinos; direcciones y barrios legibles.'),('Control y libertad','Editar resumen, limpiar selección, volver a temática y cerrar menú con Escape.'),('Consistencia','Mismos componentes, etiquetas y navegación compartida; colores y nombres por temática.'),('Prevención de errores','Límites 1-20, fecha no pasada, datos obligatorios y resumen antes de confirmar.'),('Reconocimiento','Opciones visibles, datos prácticos juntos, ficha anterior/siguiente y FAQ.'),('Eficiencia','Preselección del recorrido desde su página; búsqueda sin tildes; enlaces al mapa.'),('Minimalismo','Jerarquía editorial y desplegables; se evita presentar las 31 fichas completas en el inicio.'),('Recuperación','Errores textuales, foco en el primer campo inválido y datos conservados al corregir.'),('Ayuda','Chat y FAQ con diez respuestas, recomendaciones y aclaración breve de las simulaciones.')]
s.append(table([['Heurística de Nielsen','Aplicación concreta']]+[list(x) for x in nielsen],[130,CW-130]))
s.extend([p('Leyes de Gestalt','h2'),p('<b>Proximidad:</b> etiqueta, campo, ayuda y error forman un bloque. <b>Semejanza:</b> tarjetas y acciones comparten formas y estilos. <b>Región común:</b> los fondos de tarjeta agrupan datos prácticos y resúmenes. <b>Figura y fondo:</b> tinta y papel separan jerarquías de lectura. <b>Continuidad:</b> listas ordenadas y navegación entre fichas guían la exploración. El color se acompaña siempre de nombres y números.')])
page(s,'Accesibilidad y adaptación','5 / Criterios de diseño')
s.extend([p('Accesibilidad implementada','h2'),p('HTML en español, un h1 por página y jerarquía de encabezados. Fotografías con textos alternativos; los recursos decorativos tienen alt vacío. Etiquetas asociadas a campos y mensajes de error conectados mediante aria-describedby. El error incluye texto y borde, no solo color. Los estados usan role="status" y los controles tienen nombres descriptivos.'),p('La navegación incluye salto al contenido. El menú funciona con teclado, expone aria-expanded y devuelve el foco al botón con Escape. Las fichas desplegables usan details/summary nativos. Los botones principales tienen al menos 48 px de alto. No hay audio automático, animaciones indispensables ni pagos.'),p('Contraste','h2'),p('Los textos principales usan tinta sobre papel o arena. Los textos de apoyo usan #59574E sobre fondos claros. Los acentos se usan con texto tinta; no se usa blanco sobre naranja o lima. El foco azul se reserva para superficies claras, cambia a lima sobre fondos oscuros y a tinta sobre los acentos. En los botones de acento se coloca dentro del borde para mantener el contraste. Las combinaciones concretas se revisan con el código y deben comprobarse también en el navegador.'),p('Mobile First','h2'),p('La base usa una columna; los bloques se distribuyen en dos o tres columnas desde md/xl cuando hay espacio. Las fotos y los iframes tienen ancho flexible. Las fichas de arte urbano permiten ver las imágenes completas con object-contain. El contenido es el mismo en móvil y escritorio; cambia su distribución.'),p('Verificación visual pendiente','h2'),p('Debe revisarse el sitio a 320, 390, 768 y 1440 px, con zoom al 200 % y teclado. El acceso al navegador de automatización no estuvo disponible en esta revisión; no se atribuyen resultados visuales ni una certificación de accesibilidad. El plan detallado está en docs/ENTREGA.md.')])
for r in DATA['recorridos']:
    page(s,r['nombre'],'6 / Guion definitivo · '+r['autor'])
    s.extend([p(esc(r['descripcion'])),p('Duración propuesta: '+esc(r['duracion']),'small')])
    for i,o in enumerate(r['puntos']):
        elements=[p(f'{i+1:02d}. {esc(o["nombre"])}','h2'),p(esc(o['descripcion'])),p('<b>Ubicación:</b> '+esc(o['direccion']),'small')]
        if o.get('notaUbicacion'): elements.append(p(esc(o['notaUbicacion']),'small'))
        for label,key in [('Actividad','actividad'),('Duración orientativa','duracion'),('Horarios','horario'),('Acceso','acceso')]: elements.append(p(f'<b>{label}:</b> '+esc(o[key]),'small'))
        elements.append(p(link(o['fuente'],'Fuente: '+o['nombre']+(' / registro original de Lara' if r['id']=='arte-urbano' else ' / consulta institucional')),'small'))
        if r['id']=='arte-urbano':
            elements.extend([photo(o['imagen'],maxw=CW,maxh=180),p('Fotografía propia de Lara Trinidad Alonso. '+esc(o['alt']),'small')])
        # Cada punto se mantiene íntegro cuando cabe; el arte incluye su foto original.
        s.append(KeepTogether(elements))
page(s,'Recursos y enlaces de consulta','7 / Fuentes y continuidad')
s.extend([p('Fotografías y derechos','h2'),p('Las fotografías del sitio son propias del grupo, según confirmación recibida para esta implementación. Las once imágenes de arte urbano pertenecen a Lara Trinidad Alonso y proceden del repositorio de su Actividad 1; las ubicaciones se actualizaron durante esta revisión. Se conservan localmente para evitar depender de enlaces externos al cargar la galería. No se asignó autoría individual a las demás fotos sin evidencia.'),p(link('https://github.com/Larialonso/Disenoydesarrolloweb/tree/main/Paredes-que-hablan','Paredes que Hablan: páginas y descripciones originales')),p(link('https://github.com/Larialonso/Disenoydesarrolloweb/tree/main/img','Repositorio de fotografías originales de Lara')),p('Identidad, iconos y tipografías','h2'),p('Logo, separadores e iconos provienen de los recursos grupales del prototipo. Las fuentes Lora, DM Sans y Manrope se sirven localmente y conservan sus licencias SIL OFL en img/fuentes/. Leaflet se sirve localmente con su licencia BSD de dos cláusulas. OpenStreetMap conserva su atribución visible en el mapa. El inventario de archivos y las fuentes por ficha se incluyen en docs/RECURSOS.md y datos/recorridos.json.'),p('Enlaces de referencia','h2'),p(link(REPO,'Repositorio público del grupo')),p(link(SITE,'GitHub Pages: comprobar después de subir esta revisión')),p(link(FIGMA,'Prototipo original en Figma')),p(link(SITE+'pantallas/design-system/index.html','Design System HTML implementado')),p('El documento actualiza el contenido y justifica las extensiones del diseño original. Antes de entregar, el grupo debe revisar sus temáticas y comprobar que la versión publicada coincida con estos archivos.','small')])
build('01-diseno-contenido.pdf','Porteña - Documento 1: diseño y contenido',s)

t=[]
cover(t,2,'Desarrollo e implementación')
page(t,'Cómo está construido el sitio','1 / Tecnologías y organización')
t.extend([p('La implementación usa HTML5, Tailwind CSS 3.4.17 y JavaScript sin frameworks frontend. El navegador recibe archivos estáticos: no hay React, Angular, Vue, Bootstrap, backend ni base de datos. Node.js se utiliza únicamente para herramientas de desarrollo y pruebas.'),table([['Carpeta o archivo','Responsabilidad'],['index.html y pantallas/','Inicio, cinco temáticas, tres comunas, 31 fichas, formularios, mapa y FAQ.'],['css/entrada.css','Directivas de Tailwind, componentes compartidos y estilos de foco/error.'],['css/styles.css','CSS compilado que se entrega y publica.'],['js/sitio.js','DOM, eventos, validación, cálculo, resumen, menú, FAQ e impresión.'],['js/chat.js y js/mapa.js','Chat de preguntas frecuentes, cálculos conversacionales, marcadores y filtros.'],['datos/','Contenido, ubicaciones y registro fotográfico de arte urbano.'],['scripts/','Generación de HTML/PDF y servidor local.'],['tests/','Pruebas con node:test y jsdom; no se cargan en producción.'],['img/ y output/pdf/','Recursos locales, licencias tipográficas y documentos.']],[115,CW-115]),p('Flujo de desarrollo','h2'),p('npm ci instala las herramientas; npm run build regenera contenido y CSS; npm test comprueba HTML e interacciones; npm start sirve el proyecto en localhost:8000. Los archivos compilados se incluyen, de modo que visualizar el sitio no requiere instalar dependencias.'),p('datos/arte-actividad-1.json conserva las once descripciones originales. El generador las sincroniza con el registro general, crea fichas HTML y actualiza el mapa. No se descarga JSON en tiempo de ejecución ni se necesita un router.')])
page(t,'Formularios y recuperación de errores','2 / Comportamiento funcional')
t.extend([p('Contacto','h2'),p('Incluye nombre, correo electrónico, motivo y mensaje. HTML declara required, type, minlength y maxlength. Al iniciarse JavaScript se prepara una validación con mensajes junto a cada campo, aria-describedby y aria-invalid; se dirige el foco al primer error. El texto se valida después de quitar espacios iniciales/finales.'),p('Se rechazan nombres de menos de dos caracteres útiles, correos inválidos, motivos vacíos y mensajes con menos de diez caracteres útiles. Los errores conservan los datos para corregir. Cuando la consulta es válida se muestra una confirmación explícitamente simulada, se limpia el formulario y el foco pasa al resultado. No hay fetch, almacenamiento local ni envío de información personal.'),p('Reserva','h2'),p('Se elige una temática, cantidad entera de 1 a 20, fecha actual o posterior, nombre, correo y adicional opcional. La fecha mínima se obtiene en el huso de Buenos Aires y se vuelve a calcular al revisar y confirmar. El enlace desde cada temática preselecciona la opción correspondiente.'),p('Al revisar se muestra recorrido, cantidad, fecha, adicional y total. Editar o cambiar datos invalida el resumen anterior. Limpiar restaura valores y elimina errores. Confirmar exige un resumen vigente, revalida los campos y comprueba que el importe sea el revisado. La confirmación no realiza cobros ni reservas reales.'),p('Degradación sin JavaScript','h2'),p('Los contenidos, imágenes, enlaces al mapa y desplegables nativos siguen disponibles. Los botones de simulación se mantienen deshabilitados y un mensaje noscript indica cómo activar las interacciones. El menú móvil conserva enlaces visibles cuando no se ejecuta el script.')])
page(t,'Precios, mapas y asistencia','3 / Lógica e integraciones')
t.append(table([['Recorrido','Precio unitario ARS']]+[[r['nombre'],f'$ {r["precio"]:,}'.replace(',','.')] for r in DATA['recorridos']],[CW*.6,CW*.4]))
t.extend([p('Cálculo en pesos argentinos','h2'),p('La guía impresa cuesta ARS $ 3.000 por persona. Fórmula: total = (precio unitario + adicional por persona) × cantidad. Fútbol para dos personas con guía impresa: (12.000 + 3.000) × 2 = ARS $ 30.000. La selección y cantidad se comprueban antes de calcular. No se utiliza moneda extranjera: no corresponde conversión ni fuente de tipo de cambio.'),p('Mapa del recorrido','h2'),p('Leaflet 1.9.4 muestra las 31 ubicaciones con marcadores numerados, filtros por temática y acceso a las fichas. La vista inicial se centra en CABA; Todos los puntos incluye Santa Clara del Mar. Las coordenadas se guardan con sus fuentes: USIG, Georef y mapa institucional de FADU. La biblioteca se justifica por sus funciones geográficas y no reemplaza las tecnologías obligatorias.'),p('El fondo usa OpenStreetMap con atribución visible. Seleccionar una parada centra su marcador y abre su ficha; los filtros permiten explorar una temática y volver a todos los puntos. Google Maps conserva los itinerarios y el respaldo sin JavaScript. Si falla el fondo cartográfico, permanecen los marcadores y enlaces. USIG no se consulta con datos de visitantes.'),p('Chat de preguntas frecuentes','h2'),p('El chat funciona en las 46 páginas con entrada de texto, preguntas sugeridas y respuestas sobre recorridos, precios, ubicaciones, reservas y accesibilidad. Calcula presupuestos con las mismas tarifas del formulario y conserva las opciones al pasar a la reserva. Usa reglas y respuestas preparadas, sin IA generativa ni transmisión de consultas. Permite limpiar, cerrar con Escape y recuperar el foco. Si no hay respuesta ofrece FAQ y contacto; también se conserva la lista buscable de diez preguntas.')])
page(t,'UX y accesibilidad en el código','4 / Decisiones técnicas')
t.extend([p('La consistencia se resuelve con Tailwind y componentes compartidos, sin duplicar un framework de estilos. Los datos prácticos se agrupan en listas de definición y las paradas usan listas ordenadas. Las páginas tienen un h1, main, header, footer e idioma declarado.'),p('Las etiquetas se conectan mediante for/id. Cada campo inválido recibe aria-invalid y un mensaje asociado; los errores contienen la palabra Error y no dependen solo del color. El foco se dirige al primer campo inválido y a las confirmaciones. Los resultados usan role="status".'),p('El menú expone aria-expanded y aria-controls, puede cerrarse con Escape y devuelve el foco a su botón. Los desplegables de contenido y FAQ usan elementos nativos details/summary. La búsqueda de FAQ no necesita recordar palabras con tildes. Las fotos informativas tienen alt; los decorativos usan alt vacío.'),p('En arte urbano, las tarjetas muestran miniaturas y la ficha presenta la fotografía completa con object-contain. Las ubicaciones se completaron según la revisión del grupo y se muestran como lugares, barrios o establecimientos, con acceso al mapa de cada obra.'),p('La validación y el resumen previo reducen errores de selección. El visitante puede editar o limpiar antes de confirmar. El aviso breve de simulación y el resultado final hacen visible el estado del sistema.'),p('Responsive','h2'),p('Los estilos parten de una columna y agregan distribución desde md/lg/xl. El mapa y las imágenes usan ancho flexible. Se conserva el contenido entre tamaños. Debe revisarse visualmente el resultado en los cuatro anchos indicados en el control de entrega; las pruebas de DOM no verifican superposiciones ni recortes visuales.')])
page(t,'Qué se comprobó y qué se corrigió','5 / Pruebas y límites')
t.append(table([['Área','Prueba automatizada'],['Estructura','Todas las páginas: idioma, h1, landmarks, IDs únicos, etiquetas, iframe con título, alt y recursos locales.'],['Navegación','Enlaces internos y anclas existentes; script compartido sin fallos en páginas sin formularios.'],['Contacto','Vacíos, espacios, correo inválido, corrección, conservación de datos y confirmación.'],['Precios','Cinco tarifas × cantidades 1 y 20 × con/sin adicional: veinte combinaciones.'],['Reserva','Cantidad 0, 21, negativa, decimal o vacía; fecha pasada; nombre vacío; resumen, edición y limpieza.'],['Contexto','Preselección desde las cinco temáticas y parámetro desconocido seguro.'],['Arte urbano','Once tarjetas y fichas con las fotos, alt, descripciones y ubicaciones originales.'],['Chat','Texto libre, sugerencias, presupuestos, cantidades, ubicaciones, enlaces, errores, Escape, foco y limpieza.'],['FAQ y menú','Búsqueda sin tildes, cero resultados y restauración; aria-expanded, Escape y foco.'],['Mapa e impresión','31 enlaces, marcadores y filtros con Leaflet, selección de fichas y apertura/restauración de fichas al imprimir.']],[95,CW-95]))
t.extend([p('Problemas detectados y resueltos','h2'),p('Se completaron lugares genéricos y comunas sin contenido. Se añadió validación de texto compuesto solo por espacios. El menú ahora inicia con aria-expanded coherente con su estado. Las reservas invalidan resúmenes anteriores al editar. La búsqueda de FAQ tolera tildes. La impresión abre las fichas y restaura el estado al terminar. Arte urbano recuperó los once registros de Lara y se completaron sus ubicaciones. Se incorporó el chat funcional, el mapa general con marcadores y la corrección del foco sobre acentos de color.'),p('Límite de la evidencia','h2'),p('Las pruebas usan node:test y jsdom. Comprueban contenido y lógica, pero no pintan CSS ni cargan realmente el mapa. El navegador de automatización no estuvo disponible: la revisión visual responsive, las pruebas con lector de pantalla y los servicios externos no se declaran aprobados. Ejecutar npm test para obtener el resultado reproducible de la revisión actual.')])
page(t,'Evidencia visual y publicación','6 / Revisión pendiente del grupo')
captures=sorted((ROOT/'docs/capturas').glob('*.png'))
if captures:
    t.append(p('Capturas proporcionadas para la revisión. Verificar que correspondan a esta versión y documentar navegador, tamaño y fecha antes de entregar.'))
    for cap in captures:
        t.extend([p(cap.stem.replace('-',' '),'h2'),photo(cap.relative_to(ROOT),maxh=440)])
else:
    t.extend([p('Capturas responsive pendientes','h2'),p('Todavía no se incorporaron capturas reales del sitio funcionando. El acceso al navegador de pruebas no estuvo disponible durante la preparación. No se reemplazan por imágenes del prototipo ni por representaciones fabricadas.'),p('Completar en navegador: inicio a 390 y 1440 px; arte urbano a 390 y 1440 px; reserva a 390, 768 y 1440 px; contacto con errores a 390 px; mapa a 768 px. Revisar además 320 px, teclado y zoom al 200 %. Guardar los PNG en docs/capturas/ y regenerar este PDF. El guion completo está en docs/ENTREGA.md.')])
t.extend([p('Repositorio y despliegue','h2'),p(link(REPO,'Repositorio público: BarbaraGaito/Actividad-2-Grupo-5')),p(link(SITE,'Sitio existente en GitHub Pages')),p(link(FIGMA,'Figma original: prototipo y diseño')),p(link(SITE+'pantallas/design-system/index.html','Design System de esta implementación')),p('El repositorio público existe y el acceso al Figma original fue verificado. Los cambios de esta revisión permanecen locales para aprobación del grupo antes de subirlos. El enlace al Design System HTML será público después de publicar. No se creó un commit ni se actualizó el despliegue en esta revisión.'),p('Colaboración verificable','h2'),p('El reparto temático fue confirmado por el grupo y figura en la carátula y el README. Cada integrante debe revisar y contribuir con su propia cuenta. No se fabrican commits ni se atribuyen aportes por cantidad de cambios. Antes de entregar deben comprobarse el historial real, los cuatro enlaces requeridos y la correspondencia entre sitio, PDF y diseño.')])
build('02-desarrollo-implementacion.pdf','Porteña - Documento 2: desarrollo e implementación',t)

# Inventario verificable, sin inventar licencias ni autores individuales.
md=['# Recursos y fuentes · Porteña','', 'Revisión: 02/11/2026. Fotografías propias del grupo según confirmación recibida. Las once imágenes de arte urbano son de Lara Trinidad Alonso; se copiaron del repositorio original sin sustituir su contenido.', '', '## Arte urbano: fotografías originales', '', '| Obra | Archivo local | Fuente original |','| --- | --- | --- |']
for o in ARTE['puntos']:
    md.append(f'| {o["nombre"]} | `{o["imagen"]}` | [Registro de Lara]({o["fuente"]}) |')
md.extend(['','## Fotografías y recursos compartidos','','Los otros PNG y SVG ya pertenecían al proyecto y al prototipo grupal. No se asignan autores individuales sin confirmación. Las fotografías se conservan como recursos del grupo; esa autoría no implica otorgar una licencia de redistribución general.','','| Archivo | Uso/origen |','| --- | --- |'])
for f in sorted((ROOT/'img').rglob('*')):
    if f.is_file() and f.suffix.lower() in ['.png','.svg']:
        md.append(f'| `{f.relative_to(ROOT).as_posix()}` | Recurso del prototipo grupal de Porteña. |')
md.extend(['','## Mapas y bibliotecas','','Leaflet 1.9.4: biblioteca JavaScript con licencia BSD de dos cláusulas incluida en vendor/leaflet/LICENSE.txt. Fondo cartográfico OpenStreetMap, con atribución visible. Coordenadas de USIG Buenos Aires, Georef Argentina y mapa institucional de FADU UBA, conservadas con sus URLs de fuente en datos/ubicaciones.json. Las coordenadas no se consultan en cada visita.','','## Tipografías','','Lora, DM Sans y Manrope se alojan en `img/fuentes/`. Se conservan los archivos `LICENCIA-lora.txt`, `LICENCIA-dmsans.txt` y `LICENCIA-manrope.txt`, correspondientes a SIL Open Font License.','','## Fuentes por ficha','','Las descripciones de arte urbano reproducen los textos de la autora. Las demás fichas combinan redacción del proyecto con fuentes de referencia institucionales. Los horarios no se fijan como permanentes: cada página remite al operador o institución. Las ubicaciones de arte urbano se actualizaron en la revisión del grupo.','','| Temática | Punto | Fuente |','| --- | --- | --- |'])
for r in DATA['recorridos']:
    for o in r['puntos']: md.append(f'| {r["nombre"]} | {o["nombre"]} | [Consultar]({o["fuente"]}) |')
(ROOT/'docs/RECURSOS.md').write_text('\n'.join(md)+'\n',encoding='utf-8')

# Reabrir y renderizar las páginas para control de composición.
resumen={}
for pdf in sorted(OUT.glob('*.pdf')):
    reader=PdfReader(pdf)
    assert all((p.extract_text() or '').strip() for p in reader.pages),pdf
    doc=pymupdf.open(pdf)
    thumbs=[]
    for index,pg in enumerate(doc):
        pix=pg.get_pixmap(matrix=pymupdf.Matrix(.65,.65),alpha=False)
        im=PILImage.frombytes('RGB',[pix.width,pix.height],pix.samples)
        thumb=PILImage.new('RGB',(400,580),'#deded9')
        im.thumbnail((390,550));thumb.paste(im,((400-im.width)//2,8))
        ImageDraw.Draw(thumb).text((12,562),f'Pagina {index+1}',fill='black')
        thumbs.append(thumb)
        if index in [0,len(doc)-1]:
            pg.get_pixmap(matrix=pymupdf.Matrix(1.2,1.2),alpha=False).save(TMP/f'{pdf.stem}-{index+1}.png')
    for start in range(0,len(thumbs),8):
        group=thumbs[start:start+8]; sheet=PILImage.new('RGB',(400*min(4,len(group)),580*((len(group)+3)//4)),'#deded9')
        for i,im in enumerate(group):sheet.paste(im,((i%4)*400,(i//4)*580))
        sheet.save(TMP/f'{pdf.stem}-plancha-{start//8+1}.png')
    resumen[pdf.name]={'paginas':len(reader.pages),'bytes':pdf.stat().st_size}
print(json.dumps(resumen,ensure_ascii=False))
