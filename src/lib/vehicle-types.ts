export interface VehicleTypeOption {
  id: string;
  label: string;
  iconName: string;
}

export const VEHICLE_TYPES_CONFIG = [
  { id: 'TURISMO_CAMPERIZADO', label: 'Camper Pequeña', iconName: 'CarFront' },
  { id: 'CAMPER_GRAN_VOLUMEN', label: 'Gran Volumen', iconName: 'Truck' },
  { id: 'CARAVANA', label: 'Caravana', iconName: 'Caravan' },
  { id: 'AUTOCARAVANA', label: 'Autocaravana', iconName: 'BusFront' },
  { id: '4X4_CAMPERIZADO', label: '4x4 Camper', iconName: 'Mountain' },
  { id: 'BARCO', label: 'Barco / Velero', iconName: 'Ship' },
] as const;
