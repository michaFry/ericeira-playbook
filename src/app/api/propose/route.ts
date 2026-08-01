import { NextResponse } from "next/server";
import { getDb, getCategoryById } from "@/lib/db";
import { parseLanguages, serializeLanguages, PROPOSE_LANGS } from "@/lib/languages";
import { normalizeKind, serializeSteps } from "@/lib/steps";
import { randomUUID } from "crypto";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = String(body.name || "").trim().slice(0, 120);
  const categoryId = String(body.categoryId || "").trim();
  const details = String(body.details || "").trim().slice(0, 2000);
  const address = String(body.address || "").trim().slice(0, 300);
  const phone = String(body.phone || "").trim().slice(0, 60);
  const email = String(body.email || "").trim().slice(0, 120);
  const url = String(body.url || "").trim().slice(0, 300);
  const hours = String(body.hours || "").trim().slice(0, 300);
  const googleNote = String(body.googleNote || "").trim().slice(0, 500);
  const kind = normalizeKind(body.kind);
  const stepsRaw = Array.isArray(body.steps)
    ? body.steps.map(String)
    : String(body.steps || "")
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
  const steps = kind === "procedure" ? serializeSteps(stepsRaw) : "";
  const allowed = new Set(PROPOSE_LANGS);
  const languages = serializeLanguages(
    parseLanguages(String(body.languages || "")).filter((c) => allowed.has(c))
  );
  const proposedBy = String(body.proposedBy || "").trim().slice(0, 80);

  if (!name || !categoryId) {
    return NextResponse.json(
      { error: "Name and category are required" },
      { status: 400 }
    );
  }

  if (!getCategoryById(categoryId)) {
    return NextResponse.json({ error: "Unknown category" }, { status: 400 });
  }

  const id = randomUUID();
  getDb()
    .prepare(
      `INSERT INTO services (id, category_id, name, details, address, phone, email, url, hours, google_note, languages, kind, steps, votes, status, created_at, proposed_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 'pending', ?, ?)`
    )
    .run(
      id,
      categoryId,
      name,
      details,
      address,
      phone,
      email,
      url,
      hours,
      googleNote,
      languages,
      kind,
      steps,
      new Date().toISOString(),
      proposedBy
    );

  return NextResponse.json({ ok: true, id });
}
