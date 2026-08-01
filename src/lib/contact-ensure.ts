/**
 * Contacts that must exist even on already-seeded databases.
 */
import type Database from "better-sqlite3";

export type CuratedContact = {
  id: string;
  category_id: string;
  name: string;
  details?: string;
  address?: string;
  phone?: string;
  email?: string;
  url?: string;
  languages?: string;
  specialty?: string;
  lat?: number;
  lng?: number;
  place_id?: string;
};

export const CURATED_CONTACTS: CuratedContact[] = [
  {
    id: "svc-andre-mudancas",
    category_id: "cat-moving",
    name: "André Mudanças",
    details:
      "Mover / transport — Ericeira & Mafra area (Google: ASTransportes, Santo Isidoro).",
    address: "R. Lugar do Canto 4, 2640-064 Santo Isidoro, Portugal",
    phone: "+351 965 670 870",
    url: "http://usadosembomestado.pt/",
    languages: "pt",
    lat: 39.0080986,
    lng: -9.3908772,
    place_id: "ChIJqf-wcfgnHw0Rk-YS-DWkm7Q",
  },
  {
    id: "svc-boardriders",
    category_id: "cat-cowork",
    name: "Boardriders Quiksilver",
    details:
      "Surf shop + café — coffee and a laptop-friendly terrace vibe. Next door to 58 Surf.",
    address: "Av. São Sebastião 36A, 2655-319 Ericeira, Portugal",
    phone: "+351 261 867 046",
    languages: "pt,en",
    lat: 38.96355,
    lng: -9.4157,
  },
  {
    id: "svc-58-surf",
    category_id: "cat-cowork",
    name: "58 Surf",
    details:
      "Flagship surf shop (Billabong / 58) — retail, not a café. Same block as Boardriders & Mean Sardine.",
    address: "Av. São Sebastião 36B, 2655-483 Ericeira, Portugal",
    phone: "+351 261 860 900",
    email: "info@58surf.com",
    url: "https://58surf.com/",
    languages: "pt,en",
    lat: 38.96345,
    lng: -9.41575,
  },
];

export function ensureCuratedContacts(db: Database.Database) {
  const exists = db.prepare(`SELECT id FROM services WHERE id = ?`);
  const insert = db.prepare(
    `INSERT INTO services (
      id, category_id, name, details, address, phone, email, url,
      hours, rating, reviews_count, google_note, languages, kind, steps,
      specialty, lat, lng, place_id, google_enriched_at,
      votes, status, created_at, proposed_by
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?,
      '', NULL, 0, '', ?, 'contact', '',
      ?, ?, ?, ?, ?,
      0, 'approved', ?, ''
    )`
  );
  const now = new Date().toISOString();
  const tx = db.transaction(() => {
    // Old combined “58 / Boardriders” tip → replaced by two clear listings
    db.prepare(
      `UPDATE services SET status = 'hidden'
       WHERE id = 'svc-58' AND status = 'approved'`
    ).run();

    for (const c of CURATED_CONTACTS) {
      if (exists.get(c.id)) continue;
      insert.run(
        c.id,
        c.category_id,
        c.name,
        c.details || "",
        c.address || "",
        c.phone || "",
        c.email || "",
        c.url || "",
        c.languages || "",
        c.specialty || "",
        c.lat ?? null,
        c.lng ?? null,
        c.place_id || "",
        c.place_id ? now : "",
        now
      );
    }
  });
  tx();
}
