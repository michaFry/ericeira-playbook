import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { applyBusinessEnrichment } from "./business-enrichment";
import { applyCategoryRestructure } from "./category-restructure";
import { applyCoordEnrichment } from "./coord-enrichment";
import { ensureCuratedContacts } from "./contact-ensure";
import { applyDescriptionEnrichment } from "./description-enrichment";
import { applyProcedureEnrichment } from "./procedure-enrichment";
import { REPORT_AUTO_HIDE_AFTER } from "./reports";
import { enrichServiceAddresses, seedDatabase } from "./seed-data";
import { applySpecialtyEnrichment } from "./specialty-enrichment";
import type {
  Category,
  ClickKind,
  Report,
  Service,
  ServiceClickStats,
  ServiceReportSummary,
  ServiceWithCategory,
  VoteNoteAdmin,
  VoteNotePublic,
} from "./types";
import { sanitizeVoteNote } from "./vote-notes";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "playbook.db");

declare global {
  // eslint-disable-next-line no-var
  var __playbookDb: Database.Database | undefined;
}

function createSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT NOT NULL DEFAULT '',
      icon TEXT NOT NULL DEFAULT 'waves',
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS services (
      id TEXT PRIMARY KEY,
      category_id TEXT NOT NULL,
      name TEXT NOT NULL,
      details TEXT NOT NULL DEFAULT '',
      address TEXT NOT NULL DEFAULT '',
      phone TEXT NOT NULL DEFAULT '',
      email TEXT NOT NULL DEFAULT '',
      url TEXT NOT NULL DEFAULT '',
      hours TEXT NOT NULL DEFAULT '',
      rating REAL,
      reviews_count INTEGER NOT NULL DEFAULT 0,
      google_note TEXT NOT NULL DEFAULT '',
      languages TEXT NOT NULL DEFAULT '',
      kind TEXT NOT NULL DEFAULT 'contact',
      steps TEXT NOT NULL DEFAULT '',
      specialty TEXT NOT NULL DEFAULT '',
      lat REAL,
      lng REAL,
      place_id TEXT NOT NULL DEFAULT '',
      google_enriched_at TEXT NOT NULL DEFAULT '',
      votes INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'approved',
      created_at TEXT NOT NULL,
      proposed_by TEXT NOT NULL DEFAULT '',
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS votes (
      id TEXT PRIMARY KEY,
      service_id TEXT NOT NULL,
      voter_key TEXT NOT NULL,
      created_at TEXT NOT NULL,
      UNIQUE(service_id, voter_key),
      FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS reports (
      id TEXT PRIMARY KEY,
      service_id TEXT NOT NULL,
      reporter_key TEXT NOT NULL,
      reason TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL,
      UNIQUE(service_id, reporter_key),
      FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS clicks (
      id TEXT PRIMARY KEY,
      service_id TEXT NOT NULL,
      kind TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS vote_notes (
      id TEXT PRIMARY KEY,
      service_id TEXT NOT NULL,
      voter_key TEXT NOT NULL,
      body TEXT NOT NULL,
      created_at TEXT NOT NULL,
      UNIQUE(service_id, voter_key),
      FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_services_category ON services(category_id);
    CREATE INDEX IF NOT EXISTS idx_services_status ON services(status);
    CREATE INDEX IF NOT EXISTS idx_reports_service ON reports(service_id);
    CREATE INDEX IF NOT EXISTS idx_clicks_service ON clicks(service_id);
    CREATE INDEX IF NOT EXISTS idx_clicks_kind ON clicks(kind);
    CREATE INDEX IF NOT EXISTS idx_vote_notes_service ON vote_notes(service_id);
  `);
}

export function getDb() {
  if (global.__playbookDb) {
    migrateSchema(global.__playbookDb);
    applyCategoryRestructure(global.__playbookDb);
    // Re-apply curated facts so enrichment file updates land without restart.
    applyBusinessEnrichment(global.__playbookDb);
    applyProcedureEnrichment(global.__playbookDb);
    applySpecialtyEnrichment(global.__playbookDb);
    ensureCuratedContacts(global.__playbookDb);
    applyCoordEnrichment(global.__playbookDb);
    applyBusinessEnrichment(global.__playbookDb);
    applyDescriptionEnrichment(global.__playbookDb);
    return global.__playbookDb;
  }

  fs.mkdirSync(DATA_DIR, { recursive: true });
  const isNew = !fs.existsSync(DB_PATH);
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  createSchema(db);
  migrateSchema(db);

  if (isNew) {
    seedDatabase(db);
  } else {
    const count = db.prepare("SELECT COUNT(*) as c FROM categories").get() as {
      c: number;
    };
    if (count.c === 0) seedDatabase(db);
  }

  enrichServiceAddresses(db);
  applyCategoryRestructure(db);
  applyBusinessEnrichment(db);
  applyProcedureEnrichment(db);
  applySpecialtyEnrichment(db);
  ensureCuratedContacts(db);
  applyCoordEnrichment(db);
  applyBusinessEnrichment(db);
  applyDescriptionEnrichment(db);
  autoHideHeavilyReportedContacts(db);

  global.__playbookDb = db;
  return db;
}

function migrateSchema(db: Database.Database) {
  const cols = (
    db.prepare("PRAGMA table_info(services)").all() as { name: string }[]
  ).map((c) => c.name);

  const add = (name: string, ddl: string) => {
    if (!cols.includes(name)) db.exec(ddl);
  };

  add("address", `ALTER TABLE services ADD COLUMN address TEXT NOT NULL DEFAULT ''`);
  add("hours", `ALTER TABLE services ADD COLUMN hours TEXT NOT NULL DEFAULT ''`);
  add("rating", `ALTER TABLE services ADD COLUMN rating REAL`);
  add(
    "reviews_count",
    `ALTER TABLE services ADD COLUMN reviews_count INTEGER NOT NULL DEFAULT 0`
  );
  add(
    "google_note",
    `ALTER TABLE services ADD COLUMN google_note TEXT NOT NULL DEFAULT ''`
  );
  add(
    "languages",
    `ALTER TABLE services ADD COLUMN languages TEXT NOT NULL DEFAULT ''`
  );
  add(
    "kind",
    `ALTER TABLE services ADD COLUMN kind TEXT NOT NULL DEFAULT 'contact'`
  );
  add(
    "steps",
    `ALTER TABLE services ADD COLUMN steps TEXT NOT NULL DEFAULT ''`
  );
  add(
    "specialty",
    `ALTER TABLE services ADD COLUMN specialty TEXT NOT NULL DEFAULT ''`
  );
  add("lat", `ALTER TABLE services ADD COLUMN lat REAL`);
  add("lng", `ALTER TABLE services ADD COLUMN lng REAL`);
  add(
    "place_id",
    `ALTER TABLE services ADD COLUMN place_id TEXT NOT NULL DEFAULT ''`
  );
  add(
    "google_enriched_at",
    `ALTER TABLE services ADD COLUMN google_enriched_at TEXT NOT NULL DEFAULT ''`
  );

  db.exec(`
    CREATE TABLE IF NOT EXISTS reports (
      id TEXT PRIMARY KEY,
      service_id TEXT NOT NULL,
      reporter_key TEXT NOT NULL,
      reason TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL,
      UNIQUE(service_id, reporter_key),
      FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS idx_reports_service ON reports(service_id);

    CREATE TABLE IF NOT EXISTS clicks (
      id TEXT PRIMARY KEY,
      service_id TEXT NOT NULL,
      kind TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS idx_clicks_service ON clicks(service_id);
    CREATE INDEX IF NOT EXISTS idx_clicks_kind ON clicks(kind);

    CREATE TABLE IF NOT EXISTS vote_notes (
      id TEXT PRIMARY KEY,
      service_id TEXT NOT NULL,
      voter_key TEXT NOT NULL,
      body TEXT NOT NULL,
      created_at TEXT NOT NULL,
      UNIQUE(service_id, voter_key),
      FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS idx_vote_notes_service ON vote_notes(service_id);
  `);
}

export function listCategories(): Category[] {
  return getDb()
    .prepare("SELECT * FROM categories ORDER BY sort_order ASC, name ASC")
    .all() as Category[];
}

export function listApprovedServices(): ServiceWithCategory[] {
  return getDb()
    .prepare(
      `SELECT s.*, c.name as category_name, c.slug as category_slug, c.icon as category_icon
       FROM services s
       JOIN categories c ON c.id = s.category_id
       WHERE s.status = 'approved'
       ORDER BY s.votes DESC, s.name ASC`
    )
    .all() as ServiceWithCategory[];
}

export function listPendingServices(): ServiceWithCategory[] {
  return getDb()
    .prepare(
      `SELECT s.*, c.name as category_name, c.slug as category_slug, c.icon as category_icon
       FROM services s
       JOIN categories c ON c.id = s.category_id
       WHERE s.status = 'pending'
       ORDER BY s.created_at DESC`
    )
    .all() as ServiceWithCategory[];
}

export function listAllServices(): ServiceWithCategory[] {
  return getDb()
    .prepare(
      `SELECT s.*, c.name as category_name, c.slug as category_slug, c.icon as category_icon
       FROM services s
       JOIN categories c ON c.id = s.category_id
       ORDER BY s.status ASC, s.votes DESC, s.name ASC`
    )
    .all() as ServiceWithCategory[];
}

export function getCategoryById(id: string): Category | undefined {
  return getDb().prepare("SELECT * FROM categories WHERE id = ?").get(id) as
    | Category
    | undefined;
}

export function getServiceById(id: string): Service | undefined {
  return getDb().prepare("SELECT * FROM services WHERE id = ?").get(id) as
    | Service
    | undefined;
}

/**
 * Hide approved contacts that already have more than REPORT_AUTO_HIDE_AFTER
 * private reports. Keeps the row; only unpublishes.
 */
export function autoHideHeavilyReportedContacts(
  db: Database.Database = getDb()
): number {
  const result = db
    .prepare(
      `UPDATE services
       SET status = 'hidden'
       WHERE status = 'approved'
         AND COALESCE(kind, 'contact') = 'contact'
         AND id IN (
           SELECT service_id FROM reports
           GROUP BY service_id
           HAVING COUNT(*) > ?
         )`
    )
    .run(REPORT_AUTO_HIDE_AFTER);
  return result.changes;
}

/** Count private reports for one service. */
export function countReportsForService(serviceId: string): number {
  const row = getDb()
    .prepare("SELECT COUNT(*) as c FROM reports WHERE service_id = ?")
    .get(serviceId) as { c: number };
  return row.c;
}

/** Aggregated private reports for admin — never exposed on public routes. */
export function listReportSummaries(): ServiceReportSummary[] {
  const db = getDb();
  const counts = db
    .prepare(
      `SELECT s.id as service_id, s.name as service_name, s.status,
              c.name as category_name, COUNT(r.id) as report_count
       FROM reports r
       JOIN services s ON s.id = r.service_id
       JOIN categories c ON c.id = s.category_id
       GROUP BY s.id
       ORDER BY report_count DESC, s.name ASC`
    )
    .all() as Omit<ServiceReportSummary, "reports">[];

  const reportsByService = db
    .prepare(
      `SELECT id, service_id, reporter_key, reason, created_at
       FROM reports ORDER BY created_at DESC`
    )
    .all() as Report[];

  const grouped = new Map<string, Report[]>();
  for (const r of reportsByService) {
    const list = grouped.get(r.service_id) || [];
    list.push(r);
    grouped.set(r.service_id, list);
  }

  return counts.map((c) => ({
    ...c,
    reports: grouped.get(c.service_id) || [],
  }));
}

const CLICK_KINDS: ClickKind[] = ["phone", "address", "email", "url"];

export function recordClick(serviceId: string, kind: ClickKind): void {
  if (!CLICK_KINDS.includes(kind)) return;
  getDb()
    .prepare(
      `INSERT INTO clicks (id, service_id, kind, created_at) VALUES (?, ?, ?, ?)`
    )
    .run(crypto.randomUUID(), serviceId, kind, new Date().toISOString());
}

/** Top clicked services for admin (default top 10). */
export function listTopClickedServices(limit = 10): ServiceClickStats[] {
  return getDb()
    .prepare(
      `SELECT s.id as service_id,
              s.name as service_name,
              s.status,
              c.name as category_name,
              COUNT(cl.id) as total_clicks,
              SUM(CASE WHEN cl.kind = 'phone' THEN 1 ELSE 0 END) as phone_clicks,
              SUM(CASE WHEN cl.kind = 'address' THEN 1 ELSE 0 END) as address_clicks,
              SUM(CASE WHEN cl.kind = 'email' THEN 1 ELSE 0 END) as email_clicks,
              SUM(CASE WHEN cl.kind = 'url' THEN 1 ELSE 0 END) as url_clicks
       FROM clicks cl
       JOIN services s ON s.id = cl.service_id
       JOIN categories c ON c.id = s.category_id
       GROUP BY s.id
       ORDER BY total_clicks DESC, s.name ASC
       LIMIT ?`
    )
    .all(limit) as ServiceClickStats[];
}

/** Public tip notes for approved services (grouped by service_id). */
export function listPublicVoteNotesByService(): Record<string, VoteNotePublic[]> {
  const rows = getDb()
    .prepare(
      `SELECT vn.id, vn.service_id, vn.body, vn.created_at
       FROM vote_notes vn
       JOIN services s ON s.id = vn.service_id
       WHERE s.status = 'approved'
       ORDER BY vn.created_at DESC`
    )
    .all() as VoteNotePublic[];

  const map: Record<string, VoteNotePublic[]> = {};
  for (const row of rows) {
    const list = map[row.service_id] || [];
    list.push(row);
    map[row.service_id] = list;
  }
  return map;
}

export function listVoteNotesForService(serviceId: string): VoteNotePublic[] {
  return getDb()
    .prepare(
      `SELECT id, service_id, body, created_at
       FROM vote_notes
       WHERE service_id = ?
       ORDER BY created_at DESC`
    )
    .all(serviceId) as VoteNotePublic[];
}

export function listAdminVoteNotes(): VoteNoteAdmin[] {
  return getDb()
    .prepare(
      `SELECT vn.id, vn.service_id, vn.body, vn.created_at,
              s.name as service_name, c.name as category_name
       FROM vote_notes vn
       JOIN services s ON s.id = vn.service_id
       JOIN categories c ON c.id = s.category_id
       ORDER BY vn.created_at DESC`
    )
    .all() as VoteNoteAdmin[];
}

/** Upsert a tip note — voter must already have an active vote. */
export function upsertVoteNote(
  serviceId: string,
  voterKey: string,
  rawBody: unknown
): { ok: true; note: VoteNotePublic } | { ok: false; error: string } {
  const body = sanitizeVoteNote(rawBody);
  if (!body) {
    return { ok: false, error: "Note too short" };
  }

  const db = getDb();
  const vote = db
    .prepare("SELECT id FROM votes WHERE service_id = ? AND voter_key = ?")
    .get(serviceId, voterKey);
  if (!vote) {
    return { ok: false, error: "Vote required first" };
  }

  const existing = db
    .prepare("SELECT id FROM vote_notes WHERE service_id = ? AND voter_key = ?")
    .get(serviceId, voterKey) as { id: string } | undefined;

  const now = new Date().toISOString();
  if (existing) {
    db.prepare(
      `UPDATE vote_notes SET body = ?, created_at = ? WHERE id = ?`
    ).run(body, now, existing.id);
    return {
      ok: true,
      note: {
        id: existing.id,
        service_id: serviceId,
        body,
        created_at: now,
      },
    };
  }

  const id = crypto.randomUUID();
  db.prepare(
    `INSERT INTO vote_notes (id, service_id, voter_key, body, created_at)
     VALUES (?, ?, ?, ?, ?)`
  ).run(id, serviceId, voterKey, body, now);

  return {
    ok: true,
    note: { id, service_id: serviceId, body, created_at: now },
  };
}

export function deleteVoteNoteById(id: string): void {
  getDb().prepare("DELETE FROM vote_notes WHERE id = ?").run(id);
}

export function deleteVoteNoteForVoter(
  serviceId: string,
  voterKey: string
): void {
  getDb()
    .prepare("DELETE FROM vote_notes WHERE service_id = ? AND voter_key = ?")
    .run(serviceId, voterKey);
}
