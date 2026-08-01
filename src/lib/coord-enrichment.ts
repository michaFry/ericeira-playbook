/**
 * Curated map coordinates for well-known Ericeira-area contacts.
 * Used when geocoding hasn't run yet, or as overrides for accuracy.
 */
import type Database from "better-sqlite3";

export const COORD_BY_SERVICE_ID: Record<string, { lat: number; lng: number }> =
  {
    // Food & drink — Ericeira
    "svc-mean-sardine": { lat: 38.9635, lng: -9.4158 },
    "svc-5emeio": { lat: 38.9624, lng: -9.4165 },
    "svc-lagoa": { lat: 38.9618, lng: -9.4178 },
    "svc-costa-fria": { lat: 38.9642, lng: -9.4172 },
    "svc-estrela": { lat: 38.9638, lng: -9.4169 },
    "svc-furnas": { lat: 38.9589, lng: -9.4175 },
    "svc-golfinho": { lat: 38.9795, lng: -9.4188 },
    "svc-onegai": { lat: 38.9631, lng: -9.4152 },
    "svc-ribas": { lat: 38.9612, lng: -9.4161 },
    "svc-cucina": { lat: 38.9627, lng: -9.4148 },
    "svc-kau": { lat: 38.9645, lng: -9.4142 },
    "svc-terco": { lat: 38.9629, lng: -9.4151 },
    "svc-talho-central": { lat: 38.9633, lng: -9.4154 },
    "svc-placido": { lat: 38.933, lng: -9.327 },
    "svc-mario-joao": { lat: 38.937, lng: -9.327 },
    // Cowork & cafés
    "svc-selina": { lat: 38.9626, lng: -9.4162 },
    "svc-brunch": { lat: 38.9622, lng: -9.4155 },
    "svc-balagan": { lat: 38.9578, lng: -9.4182 },
    "svc-barbatana": { lat: 38.978, lng: -9.42 },
    "svc-vilagale": { lat: 38.9615, lng: -9.4195 },
    "svc-organic": { lat: 38.963, lng: -9.4145 },
    "svc-the-base": { lat: 38.9619, lng: -9.4159 },
    "svc-salt": { lat: 38.9628, lng: -9.4168 },
    "svc-coastal": { lat: 38.9621, lng: -9.416 },
    "svc-boardriders": { lat: 38.96355, lng: -9.4157 },
    "svc-58-surf": { lat: 38.96345, lng: -9.41575 },
    // Cars (in / near Ericeira)
    "svc-auto-miramar": { lat: 38.955, lng: -9.408 },
    "svc-ouriceira": { lat: 38.9639, lng: -9.4128 },
    // Kids
    "svc-urban-park": { lat: 38.961, lng: -9.412 },
    "svc-boulder": { lat: 38.9648, lng: -9.4135 },
    // Health
    "svc-pure": { lat: 38.9625, lng: -9.414 },
    "svc-fisio": { lat: 38.9632, lng: -9.4146 },
    // Tech
    "svc-poetik": { lat: 38.962, lng: -9.415 },
    "svc-andre-mudancas": { lat: 39.0080986, lng: -9.3908772 },
  };

/** Fill empty lat/lng from curated list (does not overwrite geocoded values). */
export function applyCoordEnrichment(db: Database.Database) {
  const update = db.prepare(
    `UPDATE services SET lat = ?, lng = ?
     WHERE id = ? AND (lat IS NULL OR lng IS NULL)`
  );
  const tx = db.transaction(() => {
    for (const [id, c] of Object.entries(COORD_BY_SERVICE_ID)) {
      update.run(c.lat, c.lng, id);
    }
  });
  tx();
}
