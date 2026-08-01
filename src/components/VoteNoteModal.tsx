"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { VOTE_NOTE_MAX, VOTE_NOTE_MIN } from "@/lib/vote-notes";

export function VoteNoteModal({
  serviceName,
  onClose,
  onSubmit,
}: {
  serviceName: string;
  onClose: () => void;
  onSubmit: (note: string) => Promise<void>;
}) {
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const trimmed = note.trim();
  const canSend =
    trimmed.length >= VOTE_NOTE_MIN &&
    trimmed.length <= VOTE_NOTE_MAX &&
    !busy;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/40 p-0 sm:items-center sm:p-4">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md overflow-y-auto overscroll-contain rounded-t-2xl bg-white p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-xl sm:rounded-2xl sm:p-6 sm:pb-6">
        <div
          className="mx-auto mb-3 h-1 w-10 rounded-full bg-ink/15 sm:hidden"
          aria-hidden
        />
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-semibold text-ink">
              Add a short note?
            </h2>
            <p className="mt-1 text-sm text-ink-muted">
              Optional — what did you use{" "}
              <span className="font-semibold text-ink">{serviceName}</span> for?
              Example: “Changed my tires” or “Fixed a leaky tap”.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-lg text-ink-soft hover:bg-foam"
            aria-label="Skip"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <label className="block text-sm font-medium text-ink">
          Your tip{" "}
          <span className="font-normal text-ink-soft">(optional)</span>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value.slice(0, VOTE_NOTE_MAX))}
            rows={3}
            maxLength={VOTE_NOTE_MAX}
            placeholder='e.g. "Installed a new dishwasher"'
            className="mt-1.5 w-full rounded-xl border border-ocean/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-wave focus:ring-4 focus:ring-wave/15"
            autoFocus
          />
          <span className="mt-1 block text-xs text-ink-soft">
            {trimmed.length}/{VOTE_NOTE_MAX}
          </span>
        </label>

        {error && <p className="mt-2 text-sm text-coral">{error}</p>}

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="pressable min-h-11 rounded-xl px-4 py-2.5 text-sm font-semibold text-ink-muted ring-1 ring-ocean/12"
          >
            Skip
          </button>
          <button
            type="button"
            disabled={!canSend}
            onClick={async () => {
              setBusy(true);
              setError("");
              try {
                await onSubmit(trimmed);
                onClose();
              } catch {
                setError("Couldn’t save — try again.");
                setBusy(false);
              }
            }}
            className="pressable min-h-11 rounded-xl bg-ocean px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-40"
          >
            {busy ? "Saving…" : "Save note"}
          </button>
        </div>
      </div>
    </div>
  );
}
