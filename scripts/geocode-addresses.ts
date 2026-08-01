/**
 * Geocode service addresses via OpenStreetMap Nominatim.
 * Only keeps results within ~12 km of Ericeira (map radius + buffer).
 *
 * Usage: npx tsx scripts/geocode-addresses.ts
 *        npx tsx scripts/geocode-addresses.ts --force
 *        npx tsx scripts/geocode-addresses.ts --limit=20
 */
import fs from "fs";
import path from "path";
import Database from "better-sqlite3";
import {
  ERICEIRA_CENTER,
  haversineKm,
  MAP_RADIUS_KM,
} from "../src/lib/geo";

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
if (!cols.includes("lat")) db.exec(`ALTER TABLE services ADD COLUMN lat REAL`);
if (!cols.includes("lng")) db.exec(`ALTER TABLE services ADD COLUMN lng REAL`);

type Row = {
  id: string;
  name: string;
  address: string;
  lat: number | null;
  lng: number | null;
};

const rows = db
  .prepare(
    `SELECT id, name, address, lat, lng FROM services
     WHERE status = 'approved'
       AND address != ''
       AND (kind IS NULL OR kind = '' OR kind = 'contact')
     ORDER BY name`
  )
  .all() as Row[];

const targets = rows
  .filter((r) => force || r.lat == null || r.lng == null)
  .slice(0, Number.isFinite(limit) ? limit : undefined);

const update = db.prepare(
  `UPDATE services SET lat = ?, lng = ? WHERE id = ?`
);

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function geocode(address: string): Promise<{ lat: number; lng: number } | null> {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", address);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "1");
  url.searchParams.set("countrycodes", "pt");

  const res = await fetch(url.toString(), {
    headers: {
      "User-Agent": "EriceiraDadsPlaybook/1.0 (local geocode; contact via github)",
      Accept: "application/json",
    },
  });
  if (!res.ok) {
    console.warn("Nominatim HTTP", res.status, address.slice(0, 60));
    return null;
  }
  const data = (await res.json()) as Array<{ lat: string; lon: string }>;
  if (!data[0]) return null;
  return { lat: Number(data[0].lat), lng: Number(data[0].lon) };
}

async function main() {
  console.log(`Geocoding ${targets.length} of ${rows.length} addressed contacts…`);
  let ok = 0;
  let far = 0;
  let fail = 0;

  for (const row of targets) {
    try {
      const hit = await geocode(row.address);
      await sleep(1100); // Nominatim polite rate limit
      if (!hit) {
        fail++;
        console.log(`  miss  ${row.name}`);
        continue;
      }
      const dist = haversineKm(ERICEIRA_CENTER, hit);
      if (dist > MAP_RADIUS_KM + 2) {
        far++;
        console.log(
          `  far   ${row.name} (${dist.toFixed(1)} km) — coords saved, hidden on home map`
        );
        update.run(hit.lat, hit.lng, row.id);
        continue;
      }
      update.run(hit.lat, hit.lng, row.id);
      ok++;
      console.log(`  ok    ${row.name} (${dist.toFixed(1)} km)`);
    } catch (e) {
      fail++;
      console.log(`  err   ${row.name}`, e);
    }
  }

  console.log(`\nDone. in-range=${ok} far=${far} miss=${fail}`);
}

main();
