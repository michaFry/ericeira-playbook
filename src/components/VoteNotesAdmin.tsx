"use client";

import type { VoteNoteAdmin } from "@/lib/types";

export function VoteNotesAdmin({
  notes,
  onAction,
}: {
  notes: VoteNoteAdmin[];
  onAction: (payload: Record<string, unknown>) => Promise<void>;
}) {
  if (notes.length === 0) {
    return (
      <p className="rounded-2xl bg-white/70 p-8 text-center text-ink/50">
        No tip notes yet. After someone thumbs-up a contact, they can leave an
        optional short note (e.g. “Changed my tires”).
      </p>
    );
  }

  return (
    <section className="space-y-3">
      <p className="rounded-xl bg-foam px-4 py-3 text-sm text-ink-muted ring-1 ring-ocean/10">
        {notes.length} public tip note{notes.length === 1 ? "" : "s"} — visible
        on contact cards. Delete anything inappropriate.
      </p>
      <ul className="space-y-2">
        {notes.map((n) => (
          <li
            key={n.id}
            className="flex flex-wrap items-start justify-between gap-3 rounded-2xl bg-white/80 px-4 py-3 ring-1 ring-ocean/8"
          >
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-ocean">
                {n.category_name} · {n.service_name}
              </p>
              <p className="mt-1 text-sm font-medium text-ink">&ldquo;{n.body}&rdquo;</p>
              <p className="mt-1 text-xs text-ink-soft">
                {new Date(n.created_at).toLocaleString()}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (confirm("Delete this tip note?")) {
                  onAction({ action: "deleteVoteNote", id: n.id });
                }
              }}
              className="rounded-lg bg-coral/10 px-3 py-1.5 text-sm font-medium text-coral"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
