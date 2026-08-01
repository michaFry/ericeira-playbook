import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import {
  autoHideHeavilyReportedContacts,
  countReportsForService,
  getDb,
  getServiceById,
} from "@/lib/db";
import { REPORT_AUTO_HIDE_AFTER } from "@/lib/reports";

export const runtime = "nodejs";

/**
 * Private negative feedback. Never returns counts or other people's reports.
 * One report per reporter_key per service.
 * Contacts with more than REPORT_AUTO_HIDE_AFTER reports are auto-hidden.
 */
export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await request.json().catch(() => ({}));
  const reporterKey = String(body.reporterKey || "").slice(0, 80);
  const reason = String(body.reason || "").trim().slice(0, 2000);

  if (!reporterKey) {
    return NextResponse.json({ error: "Missing reporter key" }, { status: 400 });
  }

  if (reason.length < 20) {
    return NextResponse.json(
      { error: "Please describe what went wrong in detail" },
      { status: 400 }
    );
  }

  const service = getServiceById(id);
  if (!service || service.status !== "approved") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const db = getDb();
  const existing = db
    .prepare(
      "SELECT id FROM reports WHERE service_id = ? AND reporter_key = ?"
    )
    .get(id, reporterKey);

  if (existing) {
    return NextResponse.json({
      ok: true,
      alreadyReported: true,
    });
  }

  db.prepare(
    `INSERT INTO reports (id, service_id, reporter_key, reason, created_at)
     VALUES (?, ?, ?, ?, ?)`
  ).run(randomUUID(), id, reporterKey, reason, new Date().toISOString());

  const reportCount = countReportsForService(id);
  let autoHidden = false;
  if (
    reportCount > REPORT_AUTO_HIDE_AFTER &&
    (service.kind || "contact") === "contact"
  ) {
    autoHideHeavilyReportedContacts(db);
    autoHidden = true;
  }

  return NextResponse.json({
    ok: true,
    alreadyReported: false,
    autoHidden,
  });
}
