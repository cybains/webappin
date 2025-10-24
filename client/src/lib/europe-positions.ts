export type LatLng = { lat: number; lng: number };

const EUROPE_COORDINATES: Record<string, LatLng> = {
  AUT: { lat: 48.2082, lng: 16.3738 },
  BEL: { lat: 50.8503, lng: 4.3517 },
  BGR: { lat: 42.6977, lng: 23.3219 },
  HRV: { lat: 45.815, lng: 15.9819 },
  CYP: { lat: 35.1856, lng: 33.3823 },
  CZE: { lat: 50.0755, lng: 14.4378 },
  DNK: { lat: 55.6761, lng: 12.5683 },
  EST: { lat: 59.437, lng: 24.7536 },
  FIN: { lat: 60.1699, lng: 24.9384 },
  FRA: { lat: 48.8566, lng: 2.3522 },
  DEU: { lat: 52.52, lng: 13.405 },
  GRC: { lat: 37.9838, lng: 23.7275 },
  HUN: { lat: 47.4979, lng: 19.0402 },
  IRL: { lat: 53.3498, lng: -6.2603 },
  ITA: { lat: 41.9028, lng: 12.4964 },
  LVA: { lat: 56.9496, lng: 24.1052 },
  LTU: { lat: 54.6872, lng: 25.2797 },
  LUX: { lat: 49.6116, lng: 6.1319 },
  MLT: { lat: 35.9375, lng: 14.3754 },
  NLD: { lat: 52.3676, lng: 4.9041 },
  POL: { lat: 52.2297, lng: 21.0122 },
  PRT: { lat: 38.7223, lng: -9.1393 },
  ROU: { lat: 44.4268, lng: 26.1025 },
  SVK: { lat: 48.1486, lng: 17.1077 },
  SVN: { lat: 46.0569, lng: 14.5058 },
  ESP: { lat: 40.4168, lng: -3.7038 },
  SWE: { lat: 59.3293, lng: 18.0686 },
  ISL: { lat: 64.1466, lng: -21.9426 },
  LIE: { lat: 47.141, lng: 9.5209 },
  NOR: { lat: 59.9139, lng: 10.7522 },
  CHE: { lat: 46.948, lng: 7.4474 },
  GBR: { lat: 51.5072, lng: -0.1276 },
  ALB: { lat: 41.3275, lng: 19.8187 },
  BIH: { lat: 43.8563, lng: 18.4131 },
  MNE: { lat: 42.4304, lng: 19.2594 },
  MKD: { lat: 41.9981, lng: 21.4254 },
  SRB: { lat: 44.7866, lng: 20.4489 },
  XKX: { lat: 42.6629, lng: 21.1655 },
  UKR: { lat: 50.4501, lng: 30.5234 },
  MDA: { lat: 47.0105, lng: 28.8638 },
  BLR: { lat: 53.9045, lng: 27.5615 },
  RUS: { lat: 55.7558, lng: 37.6173 },
  TUR: { lat: 39.9334, lng: 32.8597 },
  ARM: { lat: 40.1792, lng: 44.4991 },
  AZE: { lat: 40.4093, lng: 49.8671 },
  GEO: { lat: 41.7151, lng: 44.8271 },
  AND: { lat: 42.5078, lng: 1.5211 },
  MCO: { lat: 43.7384, lng: 7.4246 },
  SMR: { lat: 43.9424, lng: 12.4578 },
};

const MIN_LAT = 33;
const MAX_LAT = 71.5;
const MIN_LNG = -25;
const MAX_LNG = 55;

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function iso3ToViewBoxPosition(iso3: string): { x: number; y: number } | null {
  const point = EUROPE_COORDINATES[iso3.toUpperCase()];
  if (!point) return null;

  const lat = clamp(point.lat, MIN_LAT, MAX_LAT);
  const lng = clamp(point.lng, MIN_LNG, MAX_LNG);

  const xRatio = (lng - MIN_LNG) / (MAX_LNG - MIN_LNG);
  const yRatio = (MAX_LAT - lat) / (MAX_LAT - MIN_LAT);

  const x = clamp(xRatio * 100, 0, 100);
  const y = clamp(yRatio * 70, 0, 70);

  return {
    x: Math.round(x * 10) / 10,
    y: Math.round(y * 10) / 10,
  };
}

export function hasCoordinate(iso3: string): boolean {
  return Boolean(EUROPE_COORDINATES[iso3.toUpperCase()]);
}
