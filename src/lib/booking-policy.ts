const REQUEST_ONLY_VEHICLES = [
  { title: 'Camper Javi Sánchez', owner: 'Javier Sanchez' },
  { title: 'Camper Javi Sanchez', owner: 'Javier Sanchez' },
  { title: 'Volkswagen California', owner: 'Humber Guerrero' },
];

function normalize(value: string | null | undefined) {
  return (value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();
}

export function isRequestOnlyVehicle(vehicle: { title?: string | null; owner?: { firstName?: string | null; lastName?: string | null } | null }) {
  const title = normalize(vehicle.title);
  const owner = normalize(`${vehicle.owner?.firstName || ''} ${vehicle.owner?.lastName || ''}`);
  return REQUEST_ONLY_VEHICLES.some((item) => normalize(item.title) === title && normalize(item.owner) === owner);
}
