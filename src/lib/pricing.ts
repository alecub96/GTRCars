export interface PricingBreakdown {
  totalDays: number;
  basePricePerDay: number;
  basePriceTotal: number;
  cleaningFee: number;
  extrasTotal: number;
  travelerFee: number;       // Tarifa de gestión de plataforma al cliente (9.7%)
  ownerFee: number;          // Comisión al propietario (0%, el propietario no paga nada)
  ownerPayout: number;       // Pago íntegro al propietario (100% de la tarifa)
  subtotalBeforeFees: number;
  totalAmount: number;       // Lo que paga el cliente (subtotal + 9.7% gestión)
  discountPct: number;
}

export interface PricingRuleInput {
  startDate: Date;
  endDate: Date;
  pricePerDay: number;
}

export function calculatePricing({
  basePricePerDay,
  startDate,
  endDate,
  selectedExtras = [],
  cleaningFee = 0,
  ownershipType = 'THIRD_PARTY',
  pricingRules = [],
}: {
  basePricePerDay: number;
  startDate: Date;
  endDate: Date;
  selectedExtras?: Array<{ price: number; priceType: 'PER_RENTAL' | 'PER_DAY' }>;
  cleaningFee?: number;
  ownershipType?: 'PLATFORM' | 'THIRD_PARTY';
  pricingRules?: PricingRuleInput[];
}): PricingBreakdown {
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const totalDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  let basePriceTotal = 0;
  for (let index = 0; index < totalDays; index += 1) {
    const day = new Date(startDate);
    day.setDate(day.getDate() + index);
    const rule = pricingRules.find((candidate) => day >= candidate.startDate && day < candidate.endDate);
    basePriceTotal += rule?.pricePerDay ?? basePricePerDay;
  }
  basePriceTotal = Math.round(basePriceTotal * 100) / 100;

  const extrasTotal = selectedExtras.reduce((sum, extra) => {
    if (extra.priceType === 'PER_DAY') {
      return sum + extra.price * totalDays;
    }
    return sum + extra.price;
  }, 0);

  const subtotalBeforeFees = basePriceTotal + extrasTotal + cleaningFee;

  // Viajero: 9.7% de tarifa de gestión de plataforma (no hay cobertura de seguro)
  const travelerFee = Math.round(subtotalBeforeFees * 0.097 * 100) / 100;
  
  // Propietario: 0% de comisión (el propietario no paga nada, cobra el 100% de su tarifa fijada)
  const ownerFee = 0;

  // Total cobrado al cliente/viajero = Subtotal + tarifa de gestión de plataforma (9.7%)
  const totalAmount = Math.round((subtotalBeforeFees + travelerFee) * 100) / 100;

  // Pago al propietario = 100% del subtotal (sin deducciones)
  const ownerPayout = subtotalBeforeFees;

  return {
    totalDays,
    basePricePerDay,
    basePriceTotal,
    cleaningFee,
    extrasTotal,
    travelerFee,
    ownerFee,
    ownerPayout,
    subtotalBeforeFees,
    totalAmount,
    // No anunciamos un descuento que no se haya aplicado realmente al total.
    // Las tarifas por periodo ya quedan reflejadas día a día en basePriceTotal.
    discountPct: 0,
  };
}

export const CANARY_ISLANDS = [
  { id: 'gran-canaria', name: 'Gran Canaria', airport: 'LPA' },
  { id: 'tenerife', name: 'Tenerife', airport: 'TFN / TFS' },
  { id: 'lanzarote', name: 'Lanzarote', airport: 'ACE' },
  { id: 'fuerteventura', name: 'Fuerteventura', airport: 'FUE' },
  { id: 'la-palma', name: 'La Palma', airport: 'SPC' },
  { id: 'la-gomera', name: 'La Gomera', airport: 'GMZ' },
  { id: 'el-hierro', name: 'El Hierro', airport: 'VDE' },
  { id: 'la-graciosa', name: 'La Graciosa', airport: 'Conexión desde ACE' },
];
