import type Database from "better-sqlite3";

/**
 * Optimized category structure (~18) replacing the original ~55 fragmented chips.
 * Old category ids are remapped; empty leftovers are removed.
 */
export const OPTIMIZED_CATEGORIES = [
  {
    id: "cat-moving",
    name: "Moving In, Moving Out",
    slug: "moving-in-out",
    description:
      "Settle in or leave smoothly: utilities, energy, address updates, cleaning, and the pitfalls of overpriced agents.",
    icon: "Truck",
    sort_order: 5,
  },
  {
    id: "cat-admin",
    name: "Admin & paperwork",
    slug: "admin-paperwork",
    description:
      "How-tos and contacts for bureaucracy: accounts, utilities setup mindset, newborn registration, and related tips.",
    icon: "ClipboardList",
    sort_order: 10,
  },
  {
    id: "cat-cars",
    name: "Cars",
    slug: "cars",
    description:
      "Import, selling, mechanics, tyres, and updating your vehicle registration address.",
    icon: "Car",
    sort_order: 20,
  },
  {
    id: "cat-energy",
    name: "Energy & climate",
    slug: "energy-climate",
    description:
      "Compare energy providers, heating, heat pumps, and solar.",
    icon: "Zap",
    sort_order: 30,
  },
  {
    id: "cat-build",
    name: "Build & renovate",
    slug: "build-renovate",
    description:
      "How to hire safely, plus builders, handymen, architects, structural engineers, and home inspectors.",
    icon: "HardHat",
    sort_order: 40,
  },
  {
    id: "cat-trades",
    name: "Trades",
    slug: "trades",
    description:
      "Electricians, plumbers, painters, metalwork, appliance repair, and chimney work.",
    icon: "Wrench",
    sort_order: 50,
  },
  {
    id: "cat-openings",
    name: "Gates, windows & doors",
    slug: "gates-windows-doors",
    description:
      "Automatic gates, garage doors, rolling shutters, windows, PVC, gutters, and insulation.",
    icon: "DoorOpen",
    sort_order: 60,
  },
  {
    id: "cat-wood",
    name: "Wood, decks, furniture & materials",
    slug: "wood-decks-furniture-materials",
    description:
      "Timber yards, wood delivery, decks, carpenters, custom furniture, SPA fit-out, stone and kitchen countertops.",
    icon: "TreePine",
    sort_order: 70,
  },
  {
    id: "cat-garden",
    name: "Garden & outdoors",
    slug: "garden-outdoors",
    description:
      "Jardinagem, soil, trees (often cheaper outside Ericeira), and beekeeping / swarm help.",
    icon: "Flower2",
    sort_order: 80,
  },
  {
    id: "cat-cleaning",
    name: "Cleaning",
    slug: "cleaning",
    description: "Home and chimney cleaning services.",
    icon: "Sparkles",
    sort_order: 100,
  },
  {
    id: "cat-health",
    name: "Health & bodywork",
    slug: "health-bodywork",
    description:
      "Chiro, osteo, physio, training, nursing, dermatology, and dentists.",
    icon: "HeartPulse",
    sort_order: 110,
  },
  {
    id: "cat-food",
    name: "Food & drink",
    slug: "food-drink",
    description:
      "Best restaurants, beer, wine, bread, and butchers.",
    icon: "UtensilsCrossed",
    sort_order: 120,
  },
  {
    id: "cat-taxi",
    name: "Taxi & transfers",
    slug: "taxi-transfers",
    description: "Local taxis and airport / area transfers.",
    icon: "Taxi",
    sort_order: 130,
  },
  {
    id: "cat-cowork",
    name: "Cowork & cafés",
    slug: "cowork-cafes",
    description:
      "Cowork spaces and quiet café spots to work from (early opens help).",
    icon: "Coffee",
    sort_order: 140,
  },
  {
    id: "cat-tech",
    name: "Tech & repairs",
    slug: "tech-repairs",
    description: "IT, networks, phone/device repair, and affordable gear.",
    icon: "Laptop",
    sort_order: 150,
  },
  {
    id: "cat-legal",
    name: "Taxes & legal",
    slug: "taxes-legal",
    description: "Tax, corporate law, and accounting.",
    icon: "Scale",
    sort_order: 160,
  },
  {
    id: "cat-kids",
    name: "Kids activities",
    slug: "kids-activities",
    description:
      "Indoor activities for kids — Ericeira first, then Sintra / Lisboa.",
    icon: "Gamepad2",
    sort_order: 170,
  },
  {
    id: "cat-creative",
    name: "Creative",
    slug: "creative",
    description: "Photographers, shirt printing, and similar creatives.",
    icon: "Camera",
    sort_order: 180,
  },
] as const;

/** Map every legacy category id → optimized category id. */
export const CATEGORY_REMAP: Record<string, string> = {
  "cat-moving": "cat-moving",
  "cat-admin": "cat-admin",
  "cat-newborn": "cat-admin",

  "cat-car": "cat-cars",
  "cat-mechanic": "cat-cars",
  "cat-car-reg": "cat-cars",

  "cat-energy": "cat-energy",
  "cat-heating": "cat-energy",
  "cat-solar": "cat-energy",

  "cat-construction": "cat-build",
  "cat-builders": "cat-build",
  "cat-handyman": "cat-build",
  "cat-architect": "cat-build",
  "cat-structural": "cat-build",
  "cat-inspection": "cat-build",

  "cat-electrician": "cat-trades",
  "cat-plumber": "cat-trades",
  "cat-painting": "cat-trades",
  "cat-metal": "cat-trades",
  "cat-appliances": "cat-trades",
  "cat-chimney": "cat-cleaning",

  "cat-gate": "cat-openings",
  "cat-garage": "cat-openings",
  "cat-shutter": "cat-openings",
  "cat-windows": "cat-openings",
  "cat-gutter": "cat-openings",
  "cat-insulation": "cat-openings",

  "cat-deck": "cat-wood",
  "cat-wood-buy": "cat-wood",
  "cat-wood-delivery": "cat-wood",
  "cat-carpenter": "cat-wood",
  "cat-furniture": "cat-wood",
  "cat-spa": "cat-wood",
  "cat-stones": "cat-wood",

  "cat-garden": "cat-garden",
  "cat-trees": "cat-garden",
  "cat-beekeeping": "cat-garden",

  "cat-cleaning": "cat-cleaning",

  "cat-chiro": "cat-health",
  "cat-nurse": "cat-health",
  "cat-derm": "cat-health",
  "cat-dentist": "cat-health",

  "cat-restaurant": "cat-food",
  "cat-beer": "cat-food",
  "cat-wine": "cat-food",
  "cat-bread": "cat-food",
  "cat-butcher": "cat-food",

  "cat-taxi": "cat-taxi",
  "cat-cowork": "cat-cowork",

  "cat-it": "cat-tech",
  "cat-repair": "cat-tech",
  "cat-cheap": "cat-tech",

  "cat-taxes": "cat-legal",
  "cat-kids": "cat-kids",

  "cat-photo": "cat-creative",
  "cat-shirts": "cat-creative",
};

const RESTRUCTURE_FLAG = "category_restructure_v1";

/** Keep optimized category rows in sync on every boot (safe after v1 remap). */
export function ensureOptimizedCategories(db: Database.Database) {
  const upsert = db.prepare(
    `INSERT INTO categories (id, name, slug, description, icon, sort_order)
     VALUES (@id, @name, @slug, @description, @icon, @sort_order)
     ON CONFLICT(id) DO UPDATE SET
       name = excluded.name,
       slug = excluded.slug,
       description = excluded.description,
       icon = excluded.icon,
       sort_order = excluded.sort_order`
  );
  const tx = db.transaction(() => {
    // Free new slug if an old row still holds it
    db.prepare(
      `UPDATE categories SET slug = id || '-legacy'
       WHERE slug = 'wood-decks-furniture-materials' AND id != 'cat-wood'`
    ).run();

    for (const c of OPTIMIZED_CATEGORIES) {
      upsert.run({ ...c });
    }

    // Merge Stone & countertops → Wood / materials
    db.prepare(
      `UPDATE services SET category_id = 'cat-wood' WHERE category_id = 'cat-stones'`
    ).run();
    db.prepare(`DELETE FROM categories WHERE id = 'cat-stones'`).run();
  });
  tx();
}

export function applyCategoryRestructure(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `);

  ensureOptimizedCategories(db);

  const done = db
    .prepare(`SELECT value FROM meta WHERE key = ?`)
    .get(RESTRUCTURE_FLAG) as { value: string } | undefined;
  if (done?.value === "1") return;

  const upsert = db.prepare(
    `INSERT INTO categories (id, name, slug, description, icon, sort_order)
     VALUES (@id, @name, @slug, @description, @icon, @sort_order)
     ON CONFLICT(id) DO UPDATE SET
       name = excluded.name,
       slug = excluded.slug,
       description = excluded.description,
       icon = excluded.icon,
       sort_order = excluded.sort_order`
  );

  const move = db.prepare(
    `UPDATE services SET category_id = ? WHERE category_id = ?`
  );

  const keepIds = [...OPTIMIZED_CATEGORIES.map((c) => c.id)];
  const keepPlaceholders = keepIds.map(() => "?").join(",");
  const targetSlugs = OPTIMIZED_CATEGORIES.map((c) => c.slug);

  const tx = db.transaction(() => {
    // 1. Free target slugs still held by legacy category rows
    for (const slug of targetSlugs) {
      db.prepare(
        `UPDATE categories SET slug = id || '-legacy'
         WHERE slug = ? AND id NOT IN (${keepPlaceholders})`
      ).run(slug, ...keepIds);
    }

    // 2. Ensure optimized categories exist (FK targets for remaps)
    for (const c of OPTIMIZED_CATEGORIES) {
      upsert.run({ ...c });
    }

    // 3. Move services from legacy ids → optimized ids
    for (const [from, to] of Object.entries(CATEGORY_REMAP)) {
      if (from === to) continue;
      move.run(to, from);
    }

    // 4. Drop leftover legacy categories
    const leftover = db
      .prepare(`SELECT id FROM categories WHERE id NOT IN (${keepPlaceholders})`)
      .all(...keepIds) as { id: string }[];

    for (const { id } of leftover) {
      const target = CATEGORY_REMAP[id];
      if (target) move.run(target, id);
      db.prepare(`DELETE FROM categories WHERE id = ?`).run(id);
    }

    db.prepare(
      `INSERT INTO meta (key, value) VALUES (?, ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value`
    ).run(RESTRUCTURE_FLAG, "1");
  });
  tx();
}
