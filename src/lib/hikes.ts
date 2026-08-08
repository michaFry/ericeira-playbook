/**
 * Hiking routes & trailheads around Ericeira (≈30 km).
 * Sourced from OpenStreetMap (ODbL) + a few curated local cliff-walk starts.
 * AllTrails / Wikiloc are not used — no public API and ToS forbid scraping.
 */
import type Database from "better-sqlite3";
import hikesDataset from "@/data/hikes-osm.json";

export const HIKES_CATEGORY_ID = "cat-hikes";
export const HIKES_RADIUS_KM = 30;

export type HikeRecord = {
  id: string;
  osm_id: number | null;
  name: string;
  ref: string;
  network: string;
  distance: string;
  ascent: string;
  difficulty: string;
  from: string;
  to: string;
  operator: string;
  website: string;
  description: string;
  start_lat: number;
  start_lng: number;
  pin_source: string;
  km_from_ericeira: number;
  osm_url: string;
  waymarked_url: string;
};

type HikesFile = {
  source: string;
  license: string;
  attribution: string;
  note: string;
  hikes: HikeRecord[];
};

const data = hikesDataset as HikesFile;

export function getHikes(): HikeRecord[] {
  return data.hikes;
}

export function hikeDetails(h: HikeRecord): string {
  const bits: string[] = [];
  if (h.ref) bits.push(h.ref);
  if (h.distance) {
    const d = /km/i.test(h.distance) ? h.distance : `${h.distance} km`;
    bits.push(d);
  }
  if (h.ascent) bits.push(`↗ ${h.ascent} m`);
  if (h.difficulty) bits.push(h.difficulty);
  if (h.operator) bits.push(h.operator);
  if (h.from || h.to) {
    bits.push([h.from, h.to].filter(Boolean).join(" → "));
  }
  if (h.description) bits.push(h.description);

  const pinNote =
    h.pin_source === "curated_trailhead"
      ? "Pin = trailhead / common start."
      : "Pin ≈ route area on OpenStreetMap (not always the official trailhead).";
  bits.push(pinNote);
  bits.push(`≈${h.km_from_ericeira} km from Ericeira.`);
  bits.push("Map data © OpenStreetMap (ODbL).");
  return bits.join(" · ");
}

export function hikeUrl(h: HikeRecord): string {
  return h.website || h.waymarked_url || h.osm_url || "";
}

export function hikeAddress(h: HikeRecord): string {
  if (h.from && h.to) return `From ${h.from} toward ${h.to}`;
  if (h.from) return `Start area: ${h.from}`;
  if (h.pin_source === "curated_trailhead") return "Trailhead / common start";
  return "Trail area (OSM route)";
}

/** Insert/update hike listings so refreshed OSM JSON lands without a DB wipe. */
export function ensureHikes(db: Database.Database) {
  const upsert = db.prepare(
    `INSERT INTO services (
      id, category_id, name, details, address, phone, email, url,
      hours, rating, reviews_count, google_note, languages, kind, steps,
      specialty, lat, lng, place_id, google_enriched_at,
      votes, status, created_at, proposed_by
    ) VALUES (
      @id, @category_id, @name, @details, @address, '', '', @url,
      '', NULL, 0, @google_note, '', 'contact', '',
      @specialty, @lat, @lng, @place_id, '',
      0, 'approved', @created_at, ''
    )
    ON CONFLICT(id) DO UPDATE SET
      category_id = excluded.category_id,
      name = excluded.name,
      details = excluded.details,
      address = excluded.address,
      url = excluded.url,
      google_note = excluded.google_note,
      specialty = excluded.specialty,
      lat = excluded.lat,
      lng = excluded.lng,
      place_id = excluded.place_id,
      status = CASE
        WHEN services.status IN ('rejected', 'hidden') THEN services.status
        ELSE 'approved'
      END`
  );

  const now = new Date().toISOString();
  const tx = db.transaction(() => {
    for (const h of data.hikes) {
      upsert.run({
        id: h.id,
        category_id: HIKES_CATEGORY_ID,
        name: h.ref ? `${h.ref} — ${h.name}` : h.name,
        details: hikeDetails(h),
        address: hikeAddress(h),
        url: hikeUrl(h),
        google_note:
          h.pin_source === "curated_trailhead"
            ? "Curated local trailhead"
            : "OpenStreetMap hiking route",
        specialty: "",
        lat: h.start_lat,
        lng: h.start_lng,
        place_id: h.osm_id ? `osm-relation-${h.osm_id}` : "",
        created_at: now,
      });
    }
  });
  tx();
}
