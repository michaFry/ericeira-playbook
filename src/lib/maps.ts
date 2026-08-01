/** Build a Google Maps search URL from a postal / place address. */
export function mapsSearchUrl(address: string) {
  const q = address.trim();
  if (!q) return "";
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}
