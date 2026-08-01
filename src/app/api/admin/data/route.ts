import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import {
  getDb,
  listAllServices,
  listCategories,
  listPendingServices,
  listReportSummaries,
  listTopClickedServices,
} from "@/lib/db";
import { randomUUID } from "crypto";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({
    categories: listCategories(),
    services: listAllServices(),
    pending: listPendingServices(),
    reports: listReportSummaries(),
    clickStats: listTopClickedServices(10),
  });
}

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body?.action) {
    return NextResponse.json({ error: "Missing action" }, { status: 400 });
  }

  const db = getDb();
  const action = String(body.action);

  if (action === "createCategory") {
    const name = String(body.name || "").trim();
    if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });
    const id = randomUUID();
    const slug =
      String(body.slug || name)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") || id.slice(0, 8);
    const max = db
      .prepare("SELECT COALESCE(MAX(sort_order), 0) as m FROM categories")
      .get() as { m: number };
    db.prepare(
      `INSERT INTO categories (id, name, slug, description, icon, sort_order)
       VALUES (?, ?, ?, ?, ?, ?)`
    ).run(
      id,
      name,
      slug,
      String(body.description || ""),
      String(body.icon || "Waves"),
      max.m + 10
    );
    return NextResponse.json({ ok: true, id });
  }

  if (action === "updateCategory") {
    const id = String(body.id || "");
    db.prepare(
      `UPDATE categories SET name = ?, description = ?, icon = ? WHERE id = ?`
    ).run(
      String(body.name || "").trim(),
      String(body.description || ""),
      String(body.icon || "Waves"),
      id
    );
    return NextResponse.json({ ok: true });
  }

  if (action === "deleteCategory") {
    const id = String(body.id || "");
    db.prepare("DELETE FROM services WHERE category_id = ?").run(id);
    db.prepare("DELETE FROM categories WHERE id = ?").run(id);
    return NextResponse.json({ ok: true });
  }

  if (action === "createService") {
    const name = String(body.name || "").trim();
    const categoryId = String(body.categoryId || "");
    if (!name || !categoryId) {
      return NextResponse.json(
        { error: "Name and category required" },
        { status: 400 }
      );
    }
    const id = randomUUID();
    db.prepare(
      `INSERT INTO services (id, category_id, name, details, address, phone, email, url, hours, rating, reviews_count, google_note, languages, kind, steps, specialty, votes, status, created_at, proposed_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 'approved', ?, '')`
    ).run(
      id,
      categoryId,
      name,
      String(body.details || ""),
      String(body.address || ""),
      String(body.phone || ""),
      String(body.email || ""),
      String(body.url || ""),
      String(body.hours || ""),
      body.rating != null && body.rating !== "" ? Number(body.rating) : null,
      Number(body.reviewsCount || 0),
      String(body.googleNote || ""),
      String(body.languages || "").toLowerCase(),
      body.kind === "procedure" ? "procedure" : "contact",
      body.kind === "procedure"
        ? JSON.stringify(
            Array.isArray(body.steps)
              ? body.steps
              : String(body.steps || "")
                  .split("\n")
                  .map((s: string) => s.trim())
                  .filter(Boolean)
          )
        : "",
      String(body.specialty || ""),
      new Date().toISOString()
    );
    return NextResponse.json({ ok: true, id });
  }

  if (action === "updateService") {
    const id = String(body.id || "");
    const nextAddress = String(body.address || "");
    const current = db
      .prepare("SELECT address FROM services WHERE id = ?")
      .get(id) as { address: string } | undefined;

    db.prepare(
      `UPDATE services SET category_id = ?, name = ?, details = ?, address = ?, phone = ?, email = ?, url = ?, hours = ?, rating = ?, reviews_count = ?, google_note = ?, languages = ?, kind = ?, steps = ?, specialty = ?, status = ?
       WHERE id = ?`
    ).run(
      String(body.categoryId || ""),
      String(body.name || "").trim(),
      String(body.details || ""),
      nextAddress,
      String(body.phone || ""),
      String(body.email || ""),
      String(body.url || ""),
      String(body.hours || ""),
      body.rating != null && body.rating !== "" ? Number(body.rating) : null,
      Number(body.reviewsCount || 0),
      String(body.googleNote || ""),
      String(body.languages || "").toLowerCase(),
      body.kind === "procedure" ? "procedure" : "contact",
      body.kind === "procedure"
        ? JSON.stringify(
            Array.isArray(body.steps)
              ? body.steps
              : String(body.steps || "")
                  .split("\n")
                  .map((s: string) => s.trim())
                  .filter(Boolean)
          )
        : "",
      String(body.specialty || ""),
      String(body.status || "approved"),
      id
    );

    // Address changed → clear map pin until re-geocoded
    if (current && (current.address || "") !== nextAddress) {
      db.prepare("UPDATE services SET lat = NULL, lng = NULL WHERE id = ?").run(
        id
      );
    }

    return NextResponse.json({ ok: true });
  }

  if (action === "deleteService") {
    const id = String(body.id || "");
    db.prepare("DELETE FROM votes WHERE service_id = ?").run(id);
    db.prepare("DELETE FROM reports WHERE service_id = ?").run(id);
    db.prepare("DELETE FROM services WHERE id = ?").run(id);
    return NextResponse.json({ ok: true });
  }

  if (action === "clearReports") {
    db.prepare("DELETE FROM reports WHERE service_id = ?").run(
      String(body.id || "")
    );
    return NextResponse.json({ ok: true });
  }

  if (action === "setStatus") {
    db.prepare("UPDATE services SET status = ? WHERE id = ?").run(
      String(body.status || "approved"),
      String(body.id || "")
    );
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
