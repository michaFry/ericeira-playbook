import { NextResponse } from "next/server";
import {
  getServiceById,
  listVoteNotesForService,
  upsertVoteNote,
} from "@/lib/db";
import { VOTE_NOTE_MAX } from "@/lib/vote-notes";

export const runtime = "nodejs";

/** Public list of tip notes for an approved contact. */
export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const service = getServiceById(id);
  if (!service || service.status !== "approved") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ notes: listVoteNotesForService(id) });
}

/** Save / update optional tip note after a thumbs-up. */
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

  const result = upsertVoteNote(id, voterKey, body.note);
  if (!result.ok) {
    return NextResponse.json(
      { error: result.error, maxLength: VOTE_NOTE_MAX },
      { status: 400 }
    );
  }

  return NextResponse.json({ ok: true, note: result.note });
}
