export interface PricingBreakdown {
  totalDays: number;
  basePricePerDay: number;
  basePriceTotal: number;
  cleaningFee: number;
  extrasTotal: number;
  travelerFee: number;       // Tarifa de servicio al viajero (4.5% vs ~15% en marcas de la competencia)
  ownerFee: number;          // Comisión descontada al propietario (10.0% vs 12%-15% en empresas del sector)
  ownerPayout: number;       // Lo que transfieres al propietario tras tu comisión
  subtotalBeforeFees: number;
  totalAmount: number;       // Lo que cobras tú al viajero
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

  // COMISIONES MÁS COMPETITIVAS QUE LAS MARCAS DE LA COMPETENCIA (Cobran hasta un 15% al viajero y 12% al propietario)
  // Viajero: 4.5% de gastos de gestión
  const travelerFee = Math.round(subtotalBeforeFees * 0.045 * 100) / 100;
  
  // Propietario: 10.0% de comisión si es de un tercero (0% si es camper propia de tu plataforma)
  const ownerFeeRatio = ownershipType === 'PLATFORM' ? 0.0 : 0.10;
  const ownerFee = Math.round(subtotalBeforeFees * ownerFeeRatio * 100) / 100;

  // Total cobrado al viajero = Subtotal + comisión viajero
  const totalAmount = subtotalBeforeFees + travelerFee;

  // Pago al propietario = Subtotal - comisión del propietario
  const ownerPayout = subtotalBeforeFees - ownerFee;

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
