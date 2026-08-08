/** True when both coordinates are finite numbers (usable for Maps). */
export function hasCoords(
  lat: number | null | undefined,
  lng: number | null | undefined
): lat is number {
  return (
    typeof lat === "number" &&
    typeof lng === "number" &&
    Number.isFinite(lat) &&
    Number.isFinite(lng)
  );
}

/**
 * Build a Google Maps search URL.
 * Prefer lat/lng when available — hike cards store labels like
 * "Trail area (OSM route)" which are not valid place queries.
 */
export function mapsSearchUrl(
  address: string,
  coords?: { lat?: number | null; lng?: number | null } | null
) {
  if (coords && hasCoords(coords.lat, coords.lng)) {
    return `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`;
  }
  const q = address.trim();
  if (!q) return "";
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}
