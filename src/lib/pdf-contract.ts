import jsPDF from 'jspdf';

export interface ContractPDFData {
  contractCode: string;
  date: string;
  // Arrendador (Propietario)
  owner: {
    fullName: string;
    dni: string;
    email: string;
    phone?: string;
    address?: string;
    signature?: string | null;
    signedAt?: string | null;
  };
  // Arrendatario (Conductor / Viajero)
  traveler: {
    fullName: string;
    dni: string;
    email: string;
    phone?: string;
    address?: string;
    drivingLicense?: string;
    signature?: string | null;
    signedAt?: string | null;
  };
  // Vehículo
  vehicle: {
    brand: string;
    model: string;
    plate: string;
    year: number | string;
    vin?: string;
    color?: string;
    hp?: number | string;
    pickupLocation: string;
    returnLocation: string;
  };
  // Condiciones Alquiler
  rental: {
    pickupDate: string;
    pickupTime: string;
    returnDate: string;
    returnTime: string;
    totalAmount: number | string;
    depositAmount: number | string;
    includedKmPerDay?: number | string;
    extraKmPrice?: number | string;
    fuelPolicy?: string;
  };
  // Estado Check-in / Inventario (Opcional)
  inspection?: {
    odometer?: number | string;
    fuelLevel?: string;
    cleanliness?: string;
    notes?: string;
  };
}

export function generateContractPDF(data: ContractPDFData): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
      drawHeaderSmall();
    }
  };

  const drawHeaderSmall = () => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 100, 100);
    doc.text('GTR CARS // CONTRATO PRIVADO DE ARRENDAMIENTO ENTRE PARTICULARES', margin, y);
    doc.text(`REF: ${data.contractCode}`, pageWidth - margin, y, { align: 'right' });
    y += 3.5;
    doc.setDrawColor(210, 210, 210);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageWidth - margin, y);
    y += 7;
  };

  // --- CABECERA PRINCIPAL ---
  doc.setFillColor(10, 10, 10);
  doc.rect(margin, y, contentWidth, 20, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12.5);
  doc.setTextColor(255, 255, 255);
  doc.text('CONTRATO PRIVADO DE ARRENDAMIENTO DE SUPERDEPORTIVO', margin + 5, y + 8);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(190, 190, 190);
  doc.text('Régimen Directo entre Particulares · Plataforma de Intermediación Tecnológica GTR Cars (gtrcars.es)', margin + 5, y + 14.5);
  y += 24;

  // AVISO LEGAL INTERMEDIARIO
  doc.setFillColor(248, 248, 248);
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, y, contentWidth, 17, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(20, 20, 20);
  doc.text('AVISO LEGAL OBLIGATORIO SOBRE LA INTERMEDIACIÓN:', margin + 4, y + 4.5);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(70, 70, 70);
  const disclaimer = 'El presente contrato se celebra de forma directa y exclusiva entre las partes particulares abajo firmantes. GTR Cars actúa únicamente como intermediario tecnológico para facilitar la puesta en contacto, custodia informativa y el soporte de firma digital. GTR Cars no es propietario del vehículo, no es parte contractual del arrendamiento ni asume responsabilidades derivadas del uso, daños, seguro o fianza acordada entre las partes.';
  const disclaimerLines = doc.splitTextToSize(disclaimer, contentWidth - 8);
  doc.text(disclaimerLines, margin + 4, y + 8.5);
  y += 21;

  // PARTES: ARRENDADOR Y ARRENDATARIO
  const boxWidth = (contentWidth - 4) / 2;
  const boxHeight = 38;

  // ARRENDADOR
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(210, 210, 210);
  doc.roundedRect(margin, y, boxWidth, boxHeight, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(0, 0, 0);
  doc.text('1. PARTE ARRENDADORA (PROPIETARIO)', margin + 3.5, y + 5);
  doc.setDrawColor(230, 230, 230);
  doc.line(margin + 3.5, y + 6.5, margin + boxWidth - 3.5, y + 6.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(50, 50, 50);
  doc.text(`Nombre / Titular: ${data.owner.fullName || 'No especificado'}`, margin + 3.5, y + 11.5);
  doc.text(`DNI / NIE / CIF: ${data.owner.dni || 'Verificado'}`, margin + 3.5, y + 17);
  doc.text(`Email: ${data.owner.email || '-'}`, margin + 3.5, y + 22.5);
  doc.text(`Teléfono: ${data.owner.phone || 'Verificado'}`, margin + 3.5, y + 28);
  doc.text(`Domicilio: ${data.owner.address || 'Conforme a ficha de registro'}`, margin + 3.5, y + 33.5);

  // ARRENDATARIO
  const col2X = margin + boxWidth + 4;
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(col2X, y, boxWidth, boxHeight, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(0, 0, 0);
  doc.text('2. PARTE ARRENDATARIA (CONDUCTOR)', col2X + 3.5, y + 5);
  doc.line(col2X + 3.5, y + 6.5, col2X + boxWidth - 3.5, y + 6.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(50, 50, 50);
  doc.text(`Nombre Conductor: ${data.traveler.fullName || 'No especificado'}`, col2X + 3.5, y + 11.5);
  doc.text(`DNI / Pasaporte: ${data.traveler.dni || 'Verificado'}`, col2X + 3.5, y + 17);
  doc.text(`Email: ${data.traveler.email || '-'}`, col2X + 3.5, y + 22.5);
  doc.text(`Teléfono: ${data.traveler.phone || 'Verificado'}`, col2X + 3.5, y + 28);
  doc.text(`Permiso Conducir: ${data.traveler.drivingLicense || 'Permiso B en vigor'}`, col2X + 3.5, y + 33.5);

  y += boxHeight + 5;

  // VEHÍCULO Y CONDICIONES ECONÓMICAS
  doc.setFillColor(250, 250, 250);
  doc.setDrawColor(210, 210, 210);
  doc.roundedRect(margin, y, contentWidth, 34, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(0, 0, 0);
  doc.text('3. OBJETO DEL ARRENDAMIENTO, TARIFAS Y FECHAS', margin + 3.5, y + 5);
  doc.line(margin + 3.5, y + 6.5, margin + contentWidth - 3.5, y + 6.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(50, 50, 50);

  // Columna 1
  doc.text(`Vehículo: ${data.vehicle.brand} ${data.vehicle.model}`, margin + 3.5, y + 12);
  doc.text(`Matrícula: ${data.vehicle.plate || 'Registrada en Vault'}`, margin + 3.5, y + 17.5);
  doc.text(`Año / Potencia: ${data.vehicle.year} ${data.vehicle.hp ? '· ' + data.vehicle.hp + ' CV' : ''}`, margin + 3.5, y + 23);
  doc.text(`Lugar Recogida: ${data.vehicle.pickupLocation || 'Base VIP Acordada'}`, margin + 3.5, y + 28.5);

  // Columna 2
  const midX = margin + (contentWidth / 2);
  doc.text(`Periodo: ${data.rental.pickupDate} (${data.rental.pickupTime}) al ${data.rental.returnDate} (${data.rental.returnTime})`, midX, y + 12);
  doc.text(`Precio Total Alquiler: ${data.rental.totalAmount} €`, midX, y + 17.5);
  doc.text(`Fianza Retenida: ${data.rental.depositAmount} € (Responsabilidad directa)`, midX, y + 23);
  doc.text(`Límite Kilometraje: ${data.rental.includedKmPerDay ? data.rental.includedKmPerDay + ' km/día' : 'Sin límite'} (Exceso: ${data.rental.extraKmPrice || '3.50'} €/km)`, midX, y + 28.5);

  y += 39;

  // CLÁUSULAS
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.text('ESTIPULACIONES LEGALES VINCULANTES', margin, y);
  y += 4;

  const clauses = [
    {
      title: 'PRIMERA. Objeto y Destino Exclusivo.',
      text: 'El Arrendador cede en arrendamiento sin conductor el vehículo reseñado. El Arrendatario destinará el vehículo con la máxima diligencia exclusivamente a desplazamientos particulares por vías públicas asfaltadas y autorizadas. Queda estrictamente prohibida la conducción bajo efectos de alcohol o drogas, en circuitos o tandas no autorizadas por escrito, pruebas de velocidad, subarriendo o cesión de volante a personas no acreditadas.',
    },
    {
      title: 'SEGUNDA. Exoneración e Intermediación de GTR Cars.',
      text: 'Las partes declaran expresamente que el contrato vincula exclusivamente a Arrendador y Arrendatario. La mercantil gestora de GTR Cars interviene exclusivamente como plataforma tecnológica de intermediación de la información y pasarela digital. No es propietaria, aseguradora ni parte contractual, quedando exenta de cualquier responsabilidad por siniestros, infracciones o incumplimientos.',
    },
    {
      title: 'TERCERA. Fianza, Combustible e Incidencias.',
      text: 'La fianza pactada responde de eventuales desperfectos materiales, faltas en los niveles acordados de carburante, suciedad extraordinaria, excesos de kilometraje o sanciones de tráfico incoadas durante el periodo. La devolución o retención de la misma se gestiona directamente entre las partes con arreglo a las actas de entrega.',
    },
    {
      title: 'CUARTA. Seguro y Franquicia.',
      text: 'El vehículo cuenta con la póliza de seguro legalmente suscrita por el Arrendador. El Arrendatario asume el importe íntegro de la franquicia y el coste total de cualesquiera daños no cubiertos por la aseguradora por culpa, dolo o conducción negligente.',
    },
    {
      title: 'QUINTA. Validez Jurídica eIDAS y Ley Aplicable.',
      text: 'Ambas partes otorgan plena validez jurídica y probatoria a las firmas digitales emitidas conforme al Reglamento (UE) Nº 910/2014 (eIDAS). Para cuantas cuestiones surjan del cumplimiento de este acuerdo, las partes se someten a los juzgados y tribunales del lugar de entrega del vehículo.',
    },
  ];

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(60, 60, 60);

  for (const clause of clauses) {
    checkPageBreak(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(clause.title, margin, y);
    y += 3;

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    const lines = doc.splitTextToSize(clause.text, contentWidth);
    doc.text(lines, margin, y);
    y += lines.length * 2.8 + 2;
  }

  // ACTA DE COMPROBACIÓN
  if (data.inspection && (data.inspection.odometer || data.inspection.fuelLevel || data.inspection.notes)) {
    checkPageBreak(18);
    y += 1;
    doc.setFillColor(248, 248, 248);
    doc.setDrawColor(210, 210, 210);
    doc.roundedRect(margin, y, contentWidth, 14, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(0, 0, 0);
    doc.text('ANEXO: ACTA DE COMPROBACIÓN FOTOGRÁFICA Y TELEMETRÍA DE ENTREGA', margin + 3.5, y + 4);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(60, 60, 60);
    doc.text(`Odómetro: ${data.inspection.odometer || '-'} km  |  Nivel Carburante: ${data.inspection.fuelLevel || '100%'}  |  Estado Limpieza: ${data.inspection.cleanliness || 'Excelente'}`, margin + 3.5, y + 8);
    if (data.inspection.notes) {
      doc.text(`Observaciones: ${data.inspection.notes}`, margin + 3.5, y + 11.5);
    }
    y += 18;
  }

  // FIRMAS ELECTRÓNICAS
  checkPageBreak(38);
  y += 2;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.text('CONFORMIDAD Y FIRMAS ELECTRÓNICAS DE LAS PARTES', margin, y);
  y += 4;

  const signBoxWidth = (contentWidth - 4) / 2;
  const signBoxHeight = 32;

  // FIRMA PROPIETARIO
  doc.setDrawColor(210, 210, 210);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(margin, y, signBoxWidth, signBoxHeight, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(0, 0, 0);
  doc.text('FIRMA PARTE ARRENDADORA (PROPIETARIO)', margin + 3.5, y + 4.5);

  if (data.owner.signature) {
    if (data.owner.signature.startsWith('data:image')) {
      try {
        doc.addImage(data.owner.signature, 'PNG', margin + 5, y + 6, signBoxWidth - 10, 17);
      } catch (_) {
        doc.setFont('helvetica', 'italic');
        doc.text(data.owner.signature, margin + 5, y + 15);
      }
    } else {
      doc.setFont('helvetica', 'bold');
      doc.text(data.owner.signature, margin + 5, y + 15);
    }
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(110, 110, 110);
    doc.text(`Firma digital eIDAS · ${data.owner.signedAt || new Date().toLocaleString()}`, margin + 3.5, y + signBoxHeight - 2.5);
  } else {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7);
    doc.setTextColor(160, 160, 160);
    doc.text('(Pendiente de firma digital)', margin + 5, y + 16);
  }

  // FIRMA ARRENDATARIO (VIAJERO)
  doc.roundedRect(col2X, y, signBoxWidth, signBoxHeight, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(0, 0, 0);
  doc.text('FIRMA PARTE ARRENDATARIA (CONDUCTOR)', col2X + 3.5, y + 4.5);

  if (data.traveler.signature) {
    if (data.traveler.signature.startsWith('data:image')) {
      try {
        doc.addImage(data.traveler.signature, 'PNG', col2X + 5, y + 6, signBoxWidth - 10, 17);
      } catch (_) {
        doc.setFont('helvetica', 'italic');
        doc.text(data.traveler.signature, col2X + 5, y + 15);
      }
    } else {
      doc.setFont('helvetica', 'bold');
      doc.text(data.traveler.signature, col2X + 5, y + 15);
    }
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(110, 110, 110);
    doc.text(`Firma digital eIDAS · ${data.traveler.signedAt || new Date().toLocaleString()}`, col2X + 3.5, y + signBoxHeight - 2.5);
  } else {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7);
    doc.setTextColor(160, 160, 160);
    doc.text('(Pendiente de firma digital)', col2X + 5, y + 16);
  }

  // PIE DE PÁGINA EN TODAS LAS PÁGINAS
  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(130, 130, 130);
    doc.text(
      `Documento generado electrónicamente en https://gtrcars.es · Contrato privado entre particulares · Página ${i} de ${totalPages}`,
      pageWidth / 2,
      pageHeight - 6,
      { align: 'center' }
    );
  }

  return doc;
}
