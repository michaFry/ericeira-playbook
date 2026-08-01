import Database from "better-sqlite3";
import path from "path";
import { applyBusinessEnrichment } from "../src/lib/business-enrichment";

const db = new Database(path.join(process.cwd(), "data", "playbook.db"));
applyBusinessEnrichment(db);

const sample = db
  .prepare(
    `SELECT name, hours, rating, reviews_count FROM services
     WHERE id IN (
       'svc-ribas','svc-costa-fria','svc-lagoa','svc-cucina',
       'svc-balagan','svc-talho-central','svc-golfinho'
     )`
  )
  .all();
console.log(JSON.stringify(sample, null, 2));
console.log(
  "with rating:",
  db.prepare(`SELECT count(*) AS c FROM services WHERE rating IS NOT NULL`).get()
);
console.log(
  "with hours:",
  db.prepare(`SELECT count(*) AS c FROM services WHERE hours != ''`).get()
);
db.close();
