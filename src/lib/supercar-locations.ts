export interface CityOption {
  id: string;
  name: string;
  lat: number;
  lng: number;
  popular?: boolean;
}

export interface CountryOption {
  code: string;
  name: string;
  flag: string;
  cities: CityOption[];
}

/**
 * Principales países y ciudades con mayor mercado y volumen de alquiler
 * de vehículos deportivos, exóticos y de lujo a nivel mundial.
 */
export const SUPERCAR_LOCATIONS: CountryOption[] = [
  {
    code: 'ES',
    name: 'España',
    flag: '🇪🇸',
    cities: [
      { id: 'madrid', name: 'Madrid (Barajas / La Moraleja)', lat: 40.4168, lng: -3.7038, popular: true },
      { id: 'barcelona', name: 'Barcelona (El Prat / Pedralbes)', lat: 41.3879, lng: 2.1699, popular: true },
      { id: 'marbella', name: 'Marbella / Puerto Banús', lat: 36.5101, lng: -4.8824, popular: true },
      { id: 'mallorca-ibiza', name: 'Baleares (Ibiza / Mallorca)', lat: 39.5696, lng: 2.6502, popular: true },
      { id: 'gran-canaria', name: 'Gran Canaria (Maspalomas)', lat: 27.7606, lng: -15.5860 },
      { id: 'tenerife', name: 'Tenerife (Costa Adeje)', lat: 28.0550, lng: -16.7150 },
      { id: 'valencia', name: 'Valencia', lat: 39.4699, lng: -0.3763 },
      { id: 'sevilla', name: 'Sevilla', lat: 37.3891, lng: -5.9845 },
    ],
  },
  {
    code: 'AE',
    name: 'Emiratos Árabes Unidos',
    flag: '🇦🇪',
    cities: [
      { id: 'dubai', name: 'Dubái (Downtown / Marina)', lat: 25.2048, lng: 55.2708, popular: true },
      { id: 'abu-dhabi', name: 'Abu Dabi (Yas Marina)', lat: 24.4539, lng: 54.3773, popular: true },
    ],
  },
  {
    code: 'US',
    name: 'Estados Unidos',
    flag: '🇺🇸',
    cities: [
      { id: 'miami', name: 'Miami (South Beach / Brickell)', lat: 25.7617, lng: -80.1918, popular: true },
      { id: 'los-angeles', name: 'Los Ángeles (Beverly Hills / PCH)', lat: 34.0522, lng: -118.2437, popular: true },
      { id: 'las-vegas', name: 'Las Vegas (The Strip)', lat: 36.1699, lng: -115.1398, popular: true },
      { id: 'new-york', name: 'Nueva York (Manhattan / Hamptons)', lat: 40.7128, lng: -74.0060 },
      { id: 'scottsdale', name: 'Scottsdale / Phoenix', lat: 33.4942, lng: -111.9261 },
    ],
  },
  {
    code: 'MC',
    name: 'Mónaco',
    flag: '🇲🇨',
    cities: [
      { id: 'monte-carlo', name: 'Monte Carlo (Casino / Port Hercule)', lat: 43.7384, lng: 7.4246, popular: true },
    ],
  },
  {
    code: 'FR',
    name: 'Francia',
    flag: '🇫🇷',
    cities: [
      { id: 'cannes-nice', name: 'Costa Azul (Cannes / Niza / Saint-Tropez)', lat: 43.5528, lng: 7.0174, popular: true },
      { id: 'paris', name: 'París (Campos Elíseos / Vendôme)', lat: 48.8566, lng: 2.3522, popular: true },
    ],
  },
  {
    code: 'IT',
    name: 'Italia',
    flag: '🇮🇹',
    cities: [
      { id: 'milan', name: 'Milán (Quadrilatero della Moda)', lat: 45.4642, lng: 9.1900, popular: true },
      { id: 'maranello-bologna', name: 'Motor Valley (Maranello / Bolonia)', lat: 44.5264, lng: 10.8654, popular: true },
      { id: 'roma', name: 'Roma', lat: 41.9028, lng: 12.4964 },
      { id: 'costa-smeralda', name: 'Costa Esmeralda (Cerdeña)', lat: 41.1378, lng: 9.5312 },
    ],
  },
  {
    code: 'GB',
    name: 'Reino Unido',
    flag: '🇬🇧',
    cities: [
      { id: 'londres', name: 'Londres (Mayfair / Knightsbridge)', lat: 51.5074, lng: -0.1278, popular: true },
    ],
  },
  {
    code: 'DE',
    name: 'Alemania',
    flag: '🇩🇪',
    cities: [
      { id: 'munich', name: 'Múnich (Baviera / Autobahn)', lat: 48.1351, lng: 11.5820, popular: true },
      { id: 'frankfurt', name: 'Fráncfort', lat: 50.1109, lng: 8.6821 },
      { id: 'stuttgart', name: 'Stuttgart', lat: 48.7758, lng: 9.1829 },
      { id: 'nurburg', name: 'Nürburgring', lat: 50.3341, lng: 6.9427 },
    ],
  },
  {
    code: 'CH',
    name: 'Suiza',
    flag: '🇨🇭',
    cities: [
      { id: 'zurich', name: 'Zúrich (Bahnhofstrasse)', lat: 47.3769, lng: 8.5417, popular: true },
      { id: 'geneva', name: 'Ginebra', lat: 46.2044, lng: 6.1432 },
    ],
  },
];

export function getCitiesByCountry(countryCode: string): CityOption[] {
  const country = SUPERCAR_LOCATIONS.find((c) => c.code === countryCode);
  return country ? country.cities : [];
}

export function getCoordinatesForLocation(cityOrCountry: string): { lat: number; lng: number } {
  const query = (cityOrCountry || '').toLowerCase().trim();
  for (const country of SUPERCAR_LOCATIONS) {
    for (const city of country.cities) {
      if (
        city.name.toLowerCase().includes(query) ||
        query.includes(city.name.toLowerCase()) ||
        query.includes(city.id)
      ) {
        return { lat: city.lat, lng: city.lng };
      }
    }
  }
  // Coordenadas por defecto (Madrid)
  return { lat: 40.4168, lng: -3.7038 };
}

export function getAllCityNames(): string[] {
  const names: string[] = [];
  for (const country of SUPERCAR_LOCATIONS) {
    for (const city of country.cities) {
      names.push(city.name);
    }
  }
  return names;
}
