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
  // Garden & outdoors (from playbook “Terra de Jardim” / Trees / Beekeeping)
  {
    id: "svc-terrum",
    category_id: "cat-garden",
    name: "Terrum Jardinagem — Rui",
    details:
      "Garden maintenance / landscaping (jardinagem) — recommended in the dads playbook.",
    phone: "+351 936 027 031",
    languages: "pt",
    specialty: "gardening",
  },
  {
    id: "svc-joviplant",
    category_id: "cat-garden",
    name: "Joviplant",
    details:
      "Nursery for buying trees in bulk — often far cheaper than Ericeira prices.",
    phone: "+351 966 671 590",
    languages: "pt",
    specialty: "tree_nursery",
  },
  {
    id: "svc-beekeeper",
    category_id: "cat-garden",
    name: "Local beekeeper",
    details:
      "Pollination for fruit trees (Ericeira / Mafra). Also collects swarms from unwanted places.",
    phone: "+351 913 901 318",
    languages: "pt,en",
    specialty: "beekeeping",
  },
  {
    id: "svc-diogo-apicultor",
    category_id: "cat-garden",
    name: "Diogo Apicultor",
    details:
      "Beekeeper — pollination & swarm help. Also tree cutting / pruning. Comes to you.",
    phone: "+351 967 253 780",
    languages: "pt",
    specialty: "beekeeping",
  },
  {
    id: "svc-prehab",
    category_id: "cat-health",
    name: "Laurie — Prehab Lab",
    details:
      "Medically recommended soft-tissue therapy / mobility / performance training.",
    address: "Sobreiro, 2640-817, Portugal",
    phone: "+351 911 888 613",
    email: "prehab.ericeira@gmail.com",
    url: "https://www.prehablab.com",
    languages: "en,pt",
    specialty: "physio",
  },
  {
    id: "svc-hf-henrique-ferreira",
    category_id: "cat-cars",
    name: "HF Henrique Ferreira — Peças Auto",
    details:
      "Auto parts & accessories — Ericeira branch (also Malveira).",
    address: "N247 5, 2655-368 Ericeira, Portugal",
    phone: "+351 261 866 039",
    url: "https://maps.app.goo.gl/vx8tMHyrFd8ekiBy8",
    languages: "pt",
    specialty: "auto_parts",
    lat: 38.9597,
    lng: -9.4146,
  },
  {
    id: "svc-time-for-detail",
    category_id: "cat-cars",
    name: "Duarte — Time For Detail",
    details: "Mobile car wash & detailing — comes to your home.",
    phone: "+351 913 708 092",
    email: "info@timefordetail.pt",
    url: "https://www.timefordetail.pt",
    languages: "pt,en",
    specialty: "mobile_car_wash",
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
  const ensureVisible = db.prepare(
    `UPDATE services
     SET category_id = ?,
         status = CASE WHEN status IN ('rejected', 'hidden') THEN status ELSE 'approved' END,
         name = CASE WHEN trim(name) = '' THEN ? ELSE name END,
         phone = CASE WHEN trim(phone) = '' AND ? != '' THEN ? ELSE phone END,
         details = CASE WHEN trim(details) = '' THEN ? ELSE details END,
         languages = CASE WHEN trim(languages) = '' THEN ? ELSE languages END
     WHERE id = ?`
  );
  /** Playbook tips that must keep canonical contact facts. */
  const CANONICAL_IDS = new Set([
    "svc-terrum",
    "svc-joviplant",
    "svc-beekeeper",
    "svc-prehab",
  ]);
  const syncCanonical = db.prepare(
    `UPDATE services
     SET category_id = ?,
         status = 'approved',
         name = ?,
         phone = CASE WHEN ? != '' THEN ? ELSE phone END,
         email = CASE WHEN ? != '' THEN ? ELSE email END,
         url = CASE WHEN ? != '' THEN ? ELSE url END,
         details = CASE WHEN trim(details) = '' THEN ? ELSE details END,
         languages = CASE WHEN trim(languages) = '' THEN ? ELSE languages END,
         specialty = CASE WHEN trim(specialty) = '' AND ? != '' THEN ? ELSE specialty END
     WHERE id = ?`
  );
  const now = new Date().toISOString();
  const tx = db.transaction(() => {
    // Old combined “58 / Boardriders” tip → replaced by two clear listings
    db.prepare(
      `UPDATE services SET status = 'hidden'
       WHERE id = 'svc-58' AND status = 'approved'`
    ).run();

    for (const c of CURATED_CONTACTS) {
      if (exists.get(c.id)) {
        if (CANONICAL_IDS.has(c.id)) {
          syncCanonical.run(
            c.category_id,
            c.name,
            c.phone || "",
            c.phone || "",
            c.email || "",
            c.email || "",
            c.url || "",
            c.url || "",
            c.details || "",
            c.languages || "",
            c.specialty || "",
            c.specialty || "",
            c.id
          );
        } else {
          ensureVisible.run(
            c.category_id,
            c.name,
            c.phone || "",
            c.phone || "",
            c.details || "",
            c.languages || "",
            c.id
          );
        }
        continue;
      }
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
