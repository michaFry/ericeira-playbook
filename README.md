# Ericeira Dad's Playbook

Mini-site for the Ericeira Dads WhatsApp playbook: browse trusted local services, search everything, vote, propose tips, and manage content in a simple admin.

## Stack

- Next.js (App Router) + Tailwind
- SQLite (`better-sqlite3`) in `data/playbook.db` (created on first run, seeded from the original playbook)

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Admin: [http://localhost:3000/admin](http://localhost:3000/admin)  
Default password: `ericeira-dads` (change `ADMIN_PASSWORD` in `.env.local`).

## If localhost fails

1. Stop every Node process using port 3000
2. Delete the cache: `rm -rf .next` (PowerShell: `Remove-Item -Recurse -Force .next`)
3. Run again: `npm run dev`
4. Prefer `http://127.0.0.1:3000` over `localhost` if the browser shows `ERR_CONNECTION_RESET`

On Windows, `better-sqlite3` needs a working Node native build. If install fails, install [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) (Desktop development with C++) and rerun `npm install`.

## Notes

- Votes are one per browser (local key + server vote row)
- Community proposals stay `pending` until approved in admin
- The SQLite file is local and gitignored — each environment seeds its own DB on first start
- **Hikes & walks** pins come from OpenStreetMap hiking relations within ~30 km of Ericeira (plus a few curated local cliff-walk starts). AllTrails/Wikiloc are not used — they have no public API and forbid scraping. Refresh OSM data via Overpass into `src/data/hikes-osm.json`.
