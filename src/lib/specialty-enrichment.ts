/**
 * Specialty tags after category merges (Trades, Health, …).
 */
import type Database from "better-sqlite3";
import type { SpecialtyId } from "./specialties";

export const SPECIALTY_BY_SERVICE_ID: Record<string, SpecialtyId> = {
  // Electricians
  "svc-bogdan": "electrician",
  "svc-miguel-elec": "electrician",
  "svc-laszlo": "electrician",
  "svc-joao-elec": "electrician",
  "svc-sergio-ricardo": "electrician",
  // Plumbers
  "svc-goncalo": "plumber",
  "svc-fernando-plumb": "plumber",
  "svc-miha": "plumber",
  "svc-nuno-canal": "plumber",
  "svc-miguel-plumb": "plumber",
  "svc-les-plumb": "plumber",
  // Painters
  "svc-paulo-lopes": "painter",
  "svc-luis-ruca": "painter",
  "svc-sergio-paint": "painter",
  // Metal / welding
  "svc-wilson": "metal",
  "svc-labart": "metal",
  "svc-yann-clm": "metal",
  // Appliances
  "svc-antonio-domingues": "appliances",

  // Health — clinics first (dental), then bodywork people
  "svc-pobral": "dental",
  "svc-real-clinica": "dental",
  "svc-pure": "chiropractic",
  "svc-lencastre": "chiropractic",
  "svc-bargiela": "chiropractic",
  "svc-fisio": "physio",
  "svc-joana": "physio",
  "svc-prehab": "physio",
  "svc-gabriela": "osteopathy",
  "svc-dale": "training",
  "svc-benedita": "nursing",
  "svc-derm-lisbon": "dermatology",
};

export function applySpecialtyEnrichment(db: Database.Database) {
  const get = db.prepare(`SELECT specialty FROM services WHERE id = ?`);
  const update = db.prepare(
    `UPDATE services SET specialty = ? WHERE id = ?`
  );
  const tx = db.transaction(() => {
    for (const [id, specialty] of Object.entries(SPECIALTY_BY_SERVICE_ID)) {
      const row = get.get(id) as { specialty: string } | undefined;
      if (!row) continue;
      // Don't overwrite admin edits
      if ((row.specialty || "").trim()) continue;
      update.run(specialty, id);
    }
  });
  tx();
}
