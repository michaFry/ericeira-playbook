/**
 * Specialty tags after category merges (Trades, Health, …).
 */
import type Database from "better-sqlite3";
import type { SpecialtyId } from "./specialties";

export const SPECIALTY_BY_SERVICE_ID: Record<string, SpecialtyId> = {
  // Cars
  "svc-hf-henrique-ferreira": "auto_parts",
  "svc-time-for-detail": "mobile_car_wash",

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

  // Wood — timber yards
  "svc-balbino": "timber",
  "svc-comapla": "timber",
  "svc-ido": "timber",
  "svc-mdo": "timber",
  "svc-somassul": "timber",
  "svc-multiplacas": "timber",
  "svc-ascenso": "timber",
  "svc-jotalves": "timber",
  // Wood delivery
  "svc-lourosmad": "wood_delivery",
  "svc-sobreira": "wood_delivery",
  // Decks
  "svc-jonas-bartel": "decks",
  "svc-woodcraft": "decks",
  "svc-brian": "decks",
  // Carpenters
  "svc-brian-carp": "carpenter",
  // Custom furniture / SPA fit-out
  "svc-edson": "furniture",
  "svc-quirumed": "furniture",
  // Stone & countertops
  "svc-mpsseixo": "stone",
  "svc-stone-gzq": "stone",

  // Gates, windows & doors
  "svc-sebastec": "gates",
  "svc-bernardo-assis": "gates",
  "svc-wilson-gate": "gates",
  "svc-aluterm": "gates",
  "svc-jorge-antunes": "gates",
  "svc-silverio": "garage_doors",
  "svc-julio": "garage_doors",
  "svc-fernando-martins": "shutters",
  "svc-carmezim": "windows_doors",
  "svc-windoor": "windows_doors",
  "svc-supercaleiras": "gutters",
  "svc-isolaterm": "insulation",

  // Garden & outdoors
  "svc-terrum": "gardening",
  "svc-joviplant": "tree_nursery",
  "svc-beekeeper": "beekeeping",
  "svc-diogo-apicultor": "beekeeping",
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
