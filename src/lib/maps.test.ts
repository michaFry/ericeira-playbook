import { strict as assert } from "node:assert";
import { test } from "node:test";
import { hasCoords, mapsSearchUrl } from "./maps";

test("mapsSearchUrl prefers coordinates over address labels", () => {
  const url = mapsSearchUrl("Trail area (OSM route)", {
    lat: 38.939407,
    lng: -9.383134,
  });
  assert.equal(
    url,
    "https://www.google.com/maps/search/?api=1&query=38.939407,-9.383134"
  );
});

test("mapsSearchUrl falls back to encoded address when coords missing", () => {
  const url = mapsSearchUrl("Trail area (OSM route)");
  assert.equal(
    url,
    "https://www.google.com/maps/search/?api=1&query=Trail%20area%20(OSM%20route)"
  );
});

test("mapsSearchUrl returns empty string for blank address without coords", () => {
  assert.equal(mapsSearchUrl("   "), "");
  assert.equal(mapsSearchUrl("", { lat: null, lng: null }), "");
});

test("hasCoords rejects nullish or non-finite values", () => {
  assert.equal(hasCoords(38.9, -9.4), true);
  assert.equal(hasCoords(null, -9.4), false);
  assert.equal(hasCoords(38.9, undefined), false);
  assert.equal(hasCoords(Number.NaN, -9.4), false);
});
