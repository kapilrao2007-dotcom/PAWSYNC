/**
 * Privacy-aware location helpers.
 * PAWSYNC never exposes exact coordinates publicly (see spec section 26 - Privacy).
 * Public consumers get a coordinate "fuzzed" to ~300-500m, real coordinates are
 * only attached to the document for authorized roles (admin, assigned volunteer, org).
 */

const FUZZ_DEGREES = 0.003; // ~300m at the equator

function fuzzCoordinates([lng, lat]) {
  const jitter = () => (Math.random() - 0.5) * 2 * FUZZ_DEGREES;
  return [Number((lng + jitter()).toFixed(5)), Number((lat + jitter()).toFixed(5))];
}

/**
 * Returns a version of a location-bearing document safe for public consumption.
 * Exact coordinates are replaced with an approximate ("fuzzed") point and a flag
 * is added so the frontend can label it as approximate.
 */
function toPublicLocation(location) {
  if (!location || !location.coordinates) return location;
  return {
    ...location,
    coordinates: fuzzCoordinates(location.coordinates),
    approximate: true,
  };
}

module.exports = { fuzzCoordinates, toPublicLocation };
