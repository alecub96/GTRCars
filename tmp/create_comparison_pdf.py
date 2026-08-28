from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle

out = 'output/pdf/vaneando-comparativa-comisiones.pdf'
doc = SimpleDocTemplate(out, pagesize=A4, rightMargin=18*mm, leftMargin=18*mm, topMargin=16*mm, bottomMargin=16*mm)
styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name='Brand', parent=styles['Title'], fontName='Helvetica-Bold', fontSize=24, leading=28, textColor=colors.HexColor('#13322E'), spaceAfter=3))
styles.add(ParagraphStyle(name='Sub', parent=styles['Normal'], fontSize=11, leading=15, textColor=colors.HexColor('#16B8AA'), spaceAfter=12))
styles.add(ParagraphStyle(name='Head', parent=styles['Heading2'], fontName='Helvetica-Bold', fontSize=14, leading=18, textColor=colors.HexColor('#13322E'), spaceBefore=10, spaceAfter=6))
styles.add(ParagraphStyle(name='Body2', parent=styles['BodyText'], fontSize=9.2, leading=13, textColor=colors.HexColor('#4A4643'), spaceAfter=5))
styles.add(ParagraphStyle(name='Tiny', parent=styles['BodyText'], fontSize=7.2, leading=9.5, textColor=colors.HexColor('#6B726E')))
story = [Paragraph('Vaneando', styles['Brand']), Paragraph('Comparativa breve de comisiones para propietarios', styles['Sub'])]
story += [Paragraph('Más margen para ti, más atractivo para el viajero', styles['Head']), Paragraph('Vaneando aplica una estructura sencilla: 9,7% al propietario y 4,3% al viajero. La comparación siguiente usa información publicada por cada plataforma y puede variar según país, producto o contrato.', styles['Body2'])]
data = [
 [Paragraph('<b>Plataforma</b>', styles['Body2']), Paragraph('<b>Propietario</b>', styles['Body2']), Paragraph('<b>Viajero</b>', styles['Body2']), Paragraph('<b>Lectura rápida</b>', styles['Body2'])],
 [Paragraph('<b>Vaneando</b>', styles['Body2']), Paragraph('9,7%', styles['Body2']), Paragraph('4,3%', styles['Body2']), Paragraph('Tarifas claras y competitivas', styles['Body2'])],
 [Paragraph('Yescapa', styles['Body2']), Paragraph('Variable; hasta aprox. 15%', styles['Body2']), Paragraph('Variable', styles['Body2']), Paragraph('Depende del país y del tipo de propietario', styles['Body2'])],
 [Paragraph('Roadsurfer Spots', styles['Body2']), Paragraph('No indicado en la tarifa pública consultada', styles['Body2']), Paragraph('20% + 2,50 €', styles['Body2']), Paragraph('La tarifa publicada se carga al huésped', styles['Body2'])],
 [Paragraph('Airbnb', styles['Body2']), Paragraph('3% compartida o 14-16%', styles['Body2']), Paragraph('14,1-16,5% en tarifa compartida', styles['Body2']), Paragraph('Tiene modalidad compartida y tarifa única', styles['Body2'])],
 [Paragraph('Booking.com', styles['Body2']), Paragraph('Variable según contrato', styles['Body2']), Paragraph('No separada normalmente', styles['Body2']), Paragraph('El porcentaje aparece durante el alta', styles['Body2'])],
]
table = Table(data, colWidths=[31*mm, 43*mm, 43*mm, 57*mm], repeatRows=1)
table.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),colors.HexColor('#13322E')),('TEXTCOLOR',(0,0),(-1,0),colors.white),('BACKGROUND',(0,1),(-1,1),colors.HexColor('#F0FDFA')),('GRID',(0,0),(-1,-1),0.35,colors.HexColor('#D7E8E3')),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),6),('RIGHTPADDING',(0,0),(-1,-1),6),('TOPPADDING',(0,0),(-1,-1),7),('BOTTOMPADDING',(0,0),(-1,-1),7)]))
story += [table, Paragraph('Por qué elegir Vaneando', styles['Head'])]
for item in ['El propietario conserva el 90,3% del subtotal antes de impuestos.', 'El viajero paga solo un 4,3% de servicio, lo que ayuda a convertir visitas en reservas.', 'No hay una comisión de alta: se aplica cuando existe un alquiler confirmado.', 'Plataforma local, soporte cercano y desglose visible antes de confirmar.']:
    story.append(Paragraph('• ' + item, styles['Body2']))
story += [Paragraph('Ejemplo sobre 1.000 € de subtotal', styles['Head']), Paragraph('Con Vaneando, el viajero pagaría 1.043 € y el propietario recibiría 903 €. La cifra final puede incluir limpieza, extras, impuestos o condiciones particulares, que siempre deben mostrarse por separado.', styles['Body2']), Spacer(1, 8), Paragraph('Fuentes consultadas: Airbnb Help Center (tarifas de servicio); Yescapa Ayuda (remuneración del propietario); Roadsurfer FAQs (service fee); Booking.com Partner FAQ (comisión según acuerdo).', styles['Tiny']), Paragraph('vaneando.com  |  contacto@vaneando.com', styles['Tiny'])]
doc.build(story)

