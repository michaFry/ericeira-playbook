import { NextResponse } from "next/server";
import { getServiceById, recordClick } from "@/lib/db";
import type { ClickKind } from "@/lib/types";

export const runtime = "nodejs";

const ALLOWED: ClickKind[] = ["phone", "address", "email", "url"];

/**
 * Public click beacon for phone / address / email / link.
 * Fire-and-forget from the client — does not block navigation.
 */
export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await request.json().catch(() => ({}));
  const kind = String(body.kind || "") as ClickKind;

  if (!ALLOWED.includes(kind)) {
    return NextResponse.json({ error: "Invalid kind" }, { status: 400 });
  }

  const service = getServiceById(id);
  if (!service || service.status !== "approved") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  recordClick(id, kind);
  return NextResponse.json({ ok: true });
}
