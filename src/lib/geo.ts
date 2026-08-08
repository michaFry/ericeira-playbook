/**
 * Ericeira map constants — center + ~10 km viewing radius.
 */
export const ERICEIRA_CENTER = {
  lat: 38.9629,
  lng: -9.4156,
} as const;

/** Max distance from center for map pins (km). */
export const MAP_RADIUS_KM = 10;

/** Wider radius used for the Hikes & walks category map. */
export const HIKES_MAP_RADIUS_KM = 30;

/** Approximate degrees for maxBounds (~10 km box). */
const DEG_LAT = MAP_RADIUS_KM / 111;
const DEG_LNG = MAP_RADIUS_KM / (111 * Math.cos((ERICEIRA_CENTER.lat * Math.PI) / 180));

export const ERICEIRA_BOUNDS: [[number, number], [number, number]] = [
  [ERICEIRA_CENTER.lat - DEG_LAT, ERICEIRA_CENTER.lng - DEG_LNG],
  [ERICEIRA_CENTER.lat + DEG_LAT, ERICEIRA_CENTER.lng + DEG_LNG],
];

/** Leaflet zoom that roughly shows ~8–10 km around Ericeira. */
export const ERICEIRA_DEFAULT_ZOOM = 13;
/** Allow slight zoom-out so fitBounds can frame a full category with padding. */
export const ERICEIRA_MIN_ZOOM = 11;
/** When framing distant category pins (e.g. kids in Sintra / Lisboa). */
export const CATEGORY_MAP_MIN_ZOOM = 9;
export const ERICEIRA_MAX_ZOOM = 17;

export function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function withinEriceiraRadius(
  lat: number,
  lng: number,
  radiusKm = MAP_RADIUS_KM
): boolean {
  return (
    haversineKm(ERICEIRA_CENTER, { lat, lng }) <= radiusKm
  );
}
