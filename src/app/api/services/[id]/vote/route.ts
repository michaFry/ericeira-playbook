import { NextResponse } from "next/server";
import { getDb, getServiceById } from "@/lib/db";
import { randomUUID } from "crypto";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await request.json().catch(() => ({}));
  const voterKey = String(body.voterKey || "").slice(0, 80);
  if (!voterKey) {
    return NextResponse.json({ error: "Missing voter key" }, { status: 400 });
  }

  const service = getServiceById(id);
  if (!service || service.status !== "approved") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const db = getDb();
  const existing = db
    .prepare("SELECT id FROM votes WHERE service_id = ? AND voter_key = ?")
    .get(id, voterKey);

  if (existing) {
    db.prepare("DELETE FROM votes WHERE service_id = ? AND voter_key = ?").run(
      id,
      voterKey
    );
    db.prepare(
      "UPDATE services SET votes = MAX(votes - 1, 0) WHERE id = ?"
    ).run(id);
    const updated = getServiceById(id)!;
    return NextResponse.json({ votes: updated.votes, voted: false });
  }

  db.prepare(
    "INSERT INTO votes (id, service_id, voter_key, created_at) VALUES (?, ?, ?, ?)"
  ).run(randomUUID(), id, voterKey, new Date().toISOString());
  db.prepare("UPDATE services SET votes = votes + 1 WHERE id = ?").run(id);
  const updated = getServiceById(id)!;
  return NextResponse.json({ votes: updated.votes, voted: true });
}
