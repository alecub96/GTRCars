from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle

out = 'output/pdf/vaneando-propuesta-propietarios.pdf'
doc = SimpleDocTemplate(out, pagesize=A4, rightMargin=20*mm, leftMargin=20*mm, topMargin=18*mm, bottomMargin=18*mm)
styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name='Brand', parent=styles['Title'], fontName='Helvetica-Bold', fontSize=25, leading=29, textColor=colors.HexColor('#13322E'), spaceAfter=4))
styles.add(ParagraphStyle(name='Sub', parent=styles['Normal'], fontSize=12, leading=17, textColor=colors.HexColor('#16B8AA'), spaceAfter=14))
styles.add(ParagraphStyle(name='Head', parent=styles['Heading2'], fontName='Helvetica-Bold', fontSize=15, leading=19, textColor=colors.HexColor('#13322E'), spaceBefore=12, spaceAfter=7))
styles.add(ParagraphStyle(name='Body2', parent=styles['BodyText'], fontSize=10.5, leading=15, textColor=colors.HexColor('#4A4643'), spaceAfter=7))
styles.add(ParagraphStyle(name='Small', parent=styles['BodyText'], fontSize=8.5, leading=12, textColor=colors.HexColor('#6B726E')))

story = [Paragraph('Vaneando', styles['Brand']), Paragraph('La forma local, clara y justa de alquilar tu camper en Canarias', styles['Sub'])]
story += [Paragraph('Una mejor opción para propietarios', styles['Head']), Paragraph('Publica tu camper y recibe reservas con control, transparencia y acompañamiento cercano. Vaneando conecta a propietarios y viajeros sin complicar la gestión.', styles['Body2'])]
data = [[Paragraph('<b>Solo pagas cuando alquilas</b>', styles['Body2']), Paragraph('<b>9,7%</b><br/>comisión al propietario', styles['Body2'])], [Paragraph('<b>Más atractivo para el viajero</b>', styles['Body2']), Paragraph('<b>4,3%</b><br/>tarifa de servicio', styles['Body2'])], [Paragraph('<b>Tú decides</b>', styles['Body2']), Paragraph('Precios, disponibilidad y condiciones bajo tu control', styles['Body2'])]]
table = Table(data, colWidths=[105*mm, 60*mm])
table.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,-1),colors.HexColor('#F0FDFA')),('BOX',(0,0),(-1,-1),0.7,colors.HexColor('#B7E8E0')),('INNERGRID',(0,0),(-1,-1),0.35,colors.HexColor('#D7F2EE')),('VALIGN',(0,0),(-1,-1),'MIDDLE'),('LEFTPADDING',(0,0),(-1,-1),10),('RIGHTPADDING',(0,0),(-1,-1),10),('TOPPADDING',(0,0),(-1,-1),9),('BOTTOMPADDING',(0,0),(-1,-1),9)]))
story += [table, Paragraph('Qué recibes', styles['Head'])]
for text in ['Perfil y anuncio preparado para presentar tu camper.', 'Calendario y disponibilidad para evitar reservas incompatibles.', 'Pagos protegidos y desglose claro antes de confirmar.', 'Contrato digital, identidad verificada y soporte durante el alquiler.', 'Más visibilidad ante viajeros que buscan Canarias.']:
    story.append(Paragraph('• ' + text, styles['Body2']))
story += [Paragraph('La cuenta es tuya. El vehículo es tuyo. Las decisiones importantes también.', styles['Head']), Paragraph('Empieza con una plataforma canaria pensada para propietarios locales. Publicar es sencillo y solo se aplica comisión cuando existe un alquiler confirmado.', styles['Body2']), Spacer(1, 12), Paragraph('vaneando.com  |  contacto@vaneando.com', styles['Small'])]
doc.build(story)
