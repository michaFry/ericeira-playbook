import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { seedDatabase } from "./seed-data";
import type { Category, Service, ServiceWithCategory } from "./types";

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
      phone TEXT NOT NULL DEFAULT '',
      email TEXT NOT NULL DEFAULT '',
      url TEXT NOT NULL DEFAULT '',
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

    CREATE INDEX IF NOT EXISTS idx_services_category ON services(category_id);
    CREATE INDEX IF NOT EXISTS idx_services_status ON services(status);
  `);
}

export function getDb() {
  if (global.__playbookDb) return global.__playbookDb;

  fs.mkdirSync(DATA_DIR, { recursive: true });
  const isNew = !fs.existsSync(DB_PATH);
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  createSchema(db);

  if (isNew) {
    seedDatabase(db);
  } else {
    const count = db.prepare("SELECT COUNT(*) as c FROM categories").get() as {
      c: number;
    };
    if (count.c === 0) seedDatabase(db);
  }

  global.__playbookDb = db;
  return db;
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
