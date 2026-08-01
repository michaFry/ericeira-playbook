/**
 * Enrich contact services from Google Places API (New).
 *
 * Usage:
 *   set GOOGLE_PLACES_API_KEY in .env.local
 *   npx tsx scripts/enrich-from-google.ts
 *   npx tsx scripts/enrich-from-google.ts --force   # refresh even if place_id set
 *   npx tsx scripts/enrich-from-google.ts --limit 10
 */
import fs from "fs";
import path from "path";
import Database from "better-sqlite3";
import {
  namesLikelyMatch,
  searchPlaceSnapshot,
  sleep,
} from "../src/lib/places";

function loadEnvLocal() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!m) continue;
    if (process.env[m[1]]) continue;
    process.env[m[1]] = m[2].replace(/^["']|["']$/g, "").trim();
  }
}

loadEnvLocal();

const force = process.argv.includes("--force");
const limitArg = process.argv.find((a) => a.startsWith("--limit="));
const limit = limitArg ? Number(limitArg.split("=")[1]) : Infinity;

const dbPath = path.join(process.cwd(), "data", "playbook.db");
const db = new Database(dbPath);

const cols = (
  db.prepare("PRAGMA table_info(services)").all() as { name: string }[]
).map((c) => c.name);

function addCol(name: string, ddl: string) {
  if (!cols.includes(name)) db.exec(ddl);
}

addCol("place_id", `ALTER TABLE services ADD COLUMN place_id TEXT NOT NULL DEFAULT ''`);
addCol(
  "google_enriched_at",
  `ALTER TABLE services ADD COLUMN google_enriched_at TEXT NOT NULL DEFAULT ''`
);

type Row = {
  id: string;
  name: string;
  address: string;
  phone: string;
  url: string;
  hours: string;
  rating: number | null;
  reviews_count: number;
  google_note: string;
  place_id: string;
};

const rows = db
  .prepare(
    `SELECT id, name, address, phone, url, hours, rating, reviews_count,
            google_note, place_id
     FROM services
     WHERE status = 'approved'
       AND (kind IS NULL OR kind = '' OR kind = 'contact')
     ORDER BY name`
  )
  .all() as Row[];

const targets = rows
  .filter((r) => force || !r.place_id)
  .slice(0, Number.isFinite(limit) ? limit : undefined);

const update = db.prepare(
  `UPDATE services SET
     address = CASE WHEN ? != '' THEN ? ELSE address END,
     phone = CASE WHEN ? != '' THEN ? ELSE phone END,
     url = CASE WHEN ? != '' THEN ? ELSE url END,
     hours = CASE WHEN ? != '' THEN ? ELSE hours END,
     rating = COALESCE(?, rating),
     reviews_count = CASE WHEN ? > 0 THEN ? ELSE reviews_count END,
     google_note = CASE WHEN ? != '' THEN ? ELSE google_note END,
     place_id = ?,
     google_enriched_at = ?
   WHERE id = ?`
);

console.log(
  `Enriching ${targets.length} contacts (of ${rows.length}) via Google Places…`
);

let ok = 0;
let skip = 0;
let fail = 0;

async function main() {
  if (!process.env.GOOGLE_PLACES_API_KEY) {
    console.error(
      "\nNo GOOGLE_PLACES_API_KEY found.\n" +
        "1. Create a key in Google Cloud Console (Places API New enabled)\n" +
        "2. Add to .env.local: GOOGLE_PLACES_API_KEY=your_key\n" +
        "3. Re-run: npx tsx scripts/enrich-from-google.ts\n"
    );
    process.exit(1);
  }

  for (const row of targets) {
    const query = row.address
      ? `${row.name} ${row.address}`
      : `${row.name} Ericeira`;

    try {
      let snap = await searchPlaceSnapshot(query, {
        requireNameMatch: row.name,
      });

      // Retry with phone if name search failed
      if (!snap && row.phone) {
        snap = await searchPlaceSnapshot(row.name, {
          phoneHint: row.phone,
          requireNameMatch: row.name,
        });
      }

      // Last resort: first result without strict name match if query is specific
      if (!snap) {
        const loose = await searchPlaceSnapshot(query);
        if (
          loose &&
          namesLikelyMatch(row.name, loose.name)
        ) {
          snap = loose;
        }
      }

      if (!snap) {
        console.log(`  · no match  ${row.name}`);
        skip++;
      } else {
        const now = new Date().toISOString();
        update.run(
          snap.address,
          snap.address,
          snap.phone,
          snap.phone,
          snap.url,
          snap.url,
          snap.hours,
          snap.hours,
          snap.rating,
          snap.reviewsCount,
          snap.reviewsCount,
          snap.googleNote,
          snap.googleNote,
          snap.placeId,
          now,
          row.id
        );
        console.log(
          `  ✓ ${row.name} → ${snap.rating ?? "—"}★ (${snap.reviewsCount}) · ${snap.address.slice(0, 50)}`
        );
        ok++;
      }
    } catch (e) {
      fail++;
      console.error(`  ✗ ${row.name}:`, e instanceof Error ? e.message : e);
    }

    await sleep(250);
  }

  console.log(`\nDone. updated=${ok} no_match=${skip} errors=${fail}`);
  db.close();
}

main();
