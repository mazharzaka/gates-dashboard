/**
 * Builds the Google Maps search URL for a gate location
 * @param {{ lat: number, lng: number, address?: string }} location
 * @returns {string} Google Maps URL
 */
export function getGoogleMapsUrl(location) {
  if (!location || location.lat === undefined || location.lng === undefined) {
    return "#";
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.lat)},${encodeURIComponent(location.lng)}`;
}

