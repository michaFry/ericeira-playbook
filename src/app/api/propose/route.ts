import { NextResponse } from "next/server";
import { getDb, getCategoryById } from "@/lib/db";
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
  const phone = String(body.phone || "").trim().slice(0, 60);
  const email = String(body.email || "").trim().slice(0, 120);
  const url = String(body.url || "").trim().slice(0, 300);
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
      `INSERT INTO services (id, category_id, name, details, phone, email, url, votes, status, created_at, proposed_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, 0, 'pending', ?, ?)`
    )
    .run(
      id,
      categoryId,
      name,
      details,
      phone,
      email,
      url,
      new Date().toISOString(),
      proposedBy
    );

  return NextResponse.json({ ok: true, id });
}
