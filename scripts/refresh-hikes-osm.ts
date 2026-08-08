/**
 * Refresh src/data/hikes-osm.json from OpenStreetMap Overpass.
 * Usage: npx tsx scripts/refresh-hikes-osm.ts
 */
import fs from "fs";
import path from "path";

const CENTER = { lat: 38.9629, lng: -9.4156 };
const RADIUS_KM = 30;
const OUT = path.join(process.cwd(), "src/data/hikes-osm.json");

function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

async function overpass(query: string) {
  const servers = [
    "https://lz4.overpass-api.de/api/interpreter",
    "https://z.overpass-api.de/api/interpreter",
    "https://overpass.private.coffee/api/interpreter",
  ];
  let last: unknown;
  for (const url of servers) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "EriceiraPlaybook/0.1 (hikes refresh)",
        },
        body: new URLSearchParams({ data: query }),
      });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      return (await res.json()) as {
        elements: Array<{
          type: string;
          id: number;
          tags?: Record<string, string>;
          center?: { lat: number; lon: number };
        }>;
      };
    } catch (e) {
      last = e;
      console.warn("Overpass failed:", url, e);
    }
  }
  throw last;
}

const curated = [
  {
    id: "hike-ericeira-cliff-ribeira",
    osm_id: null as number | null,
    name: "Ericeira cliff walk — start at Ribeira d'Ilhas",
    ref: "",
    network: "local",
    distance: "up to ~11 km one-way to Foz do Lizandro",
    ascent: "",
    difficulty: "easy/moderate",
    from: "Ribeira d'Ilhas",
    to: "Foz do Lizandro",
    operator: "",
    website: "",
    description:
      "Popular coastal cliff path south from Ribeira d'Ilhas toward Ericeira and Foz do Lizandro. Pin marks a common starting point (beach parking).",
    start_lat: 38.9882,
    start_lng: -9.4198,
    pin_source: "curated_trailhead",
    km_from_ericeira: 2.8,
    osm_url: "",
    waymarked_url: "",
  },
  {
    id: "hike-ericeira-cliff-town",
    osm_id: null as number | null,
    name: "Ericeira cliff walk — start in town (Praia do Norte)",
    ref: "",
    network: "local",
    distance: "short segments or full coastal link",
    ascent: "",
    difficulty: "easy/moderate",
    from: "Praia do Norte / Ericeira",
    to: "North or south along cliffs",
    operator: "",
    website: "",
    description:
      "Access the coastal cliff paths from Ericeira town near Praia do Norte — walk north toward Ribeira d'Ilhas or south toward Foz do Lizandro.",
    start_lat: 38.9685,
    start_lng: -9.4205,
    pin_source: "curated_trailhead",
    km_from_ericeira: 0.7,
    osm_url: "",
    waymarked_url: "",
  },
  {
    id: "hike-ericeira-cliff-lizandro",
    osm_id: null as number | null,
    name: "Ericeira cliff walk — start at Foz do Lizandro",
    ref: "",
    network: "local",
    distance: "up to ~11 km one-way to Ribeira d'Ilhas",
    ascent: "",
    difficulty: "easy/moderate",
    from: "Foz do Lizandro",
    to: "Ribeira d'Ilhas",
    operator: "",
    website: "",
    description:
      "Southern common start for the Ericeira coastal cliff walk. Beach area parking/cafés; path links north toward town and Ribeira d'Ilhas.",
    start_lat: 38.9415,
    start_lng: -9.4158,
    pin_source: "curated_trailhead",
    km_from_ericeira: 2.4,
    osm_url: "",
    waymarked_url: "",
  },
];

async function main() {
  const dLat = RADIUS_KM / 111;
  const dLng = RADIUS_KM / (111 * Math.cos((CENTER.lat * Math.PI) / 180));
  const south = CENTER.lat - dLat;
  const west = CENTER.lng - dLng;
  const north = CENTER.lat + dLat;
  const east = CENTER.lng + dLng;

  const query = `[out:json][timeout:120];
relation["route"="hiking"](${south},${west},${north},${east});
out tags center;`;

  console.log("Querying Overpass…");
  const raw = await overpass(query);
  const osmHikes = [];
  for (const e of raw.elements) {
    const tags = e.tags || {};
    const lat = e.center?.lat;
    const lon = e.center?.lon;
    if (lat == null || lon == null) continue;
    const dist = haversineKm(CENTER, { lat, lng: lon });
    if (dist > RADIUS_KM) continue;
    const name =
      tags.name || tags["name:pt"] || tags["name:en"] || tags.ref || "";
    if (!name) continue;
    if (name.includes("Fátima") || name.includes("Caminho Português")) continue;
    osmHikes.push({
      id: `hike-osm-${e.id}`,
      osm_id: e.id,
      name,
      ref: tags.ref || "",
      network: tags.network || "",
      distance: tags.distance || "",
      ascent: tags.ascent || "",
      difficulty: tags.sac_scale || tags.difficulty || "",
      from: tags.from || "",
      to: tags.to || "",
      operator: tags.operator || "",
      website: tags.website || tags.url || "",
      description:
        tags.description ||
        tags["description:pt"] ||
        tags["description:en"] ||
        "",
      start_lat: Math.round(lat * 1e6) / 1e6,
      start_lng: Math.round(lon * 1e6) / 1e6,
      pin_source: "route_center",
      km_from_ericeira: Math.round(dist * 10) / 10,
      osm_url: `https://www.openstreetmap.org/relation/${e.id}`,
      waymarked_url: `https://hiking.waymarkedtrails.org/#route?id=${e.id}`,
    });
  }
  osmHikes.sort(
    (a, b) =>
      a.km_from_ericeira - b.km_from_ericeira || a.name.localeCompare(b.name)
  );

  const out = {
    source: "OpenStreetMap",
    license: "ODbL 1.0",
    attribution: "© OpenStreetMap contributors",
    radius_km: RADIUS_KM,
    center: CENTER,
    note: "Pins use OSM route centroids (approx. trail area) unless pin_source=curated_trailhead. Links open the full route on Waymarked Trails / OSM. Data © OpenStreetMap contributors (ODbL).",
    hikes: [...curated, ...osmHikes],
  };

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + "\n");
  console.log(`Wrote ${out.hikes.length} hikes → ${OUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
