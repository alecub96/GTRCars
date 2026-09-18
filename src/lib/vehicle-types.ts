export interface VehicleTypeOption {
  id: string;
  label: string;
  iconName: string;
}

export const VEHICLE_TYPES_CONFIG = [
  { id: 'COUPE', label: 'Coupé', iconName: 'CarFront' },
  { id: 'CABRIO', label: 'Descapotable', iconName: 'Wind' },
  { id: 'SEDAN_DEPORTIVO', label: 'Sedán Deportivo', iconName: 'Car' },
  { id: 'SUV_DEPORTIVO', label: 'Super SUV', iconName: 'Shield' },
] as const;
