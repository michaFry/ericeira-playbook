"use client";

import { useState } from "react";
import { X } from "lucide-react";

const MIN_REASON = 20;
const MAX_REASON = 2000;

export function ReportModal({
  serviceName,
  onClose,
  onSubmit,
}: {
  serviceName: string;
  onClose: () => void;
  onSubmit: (reason: string) => Promise<void>;
}) {
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const trimmed = reason.trim();
  const canSend = trimmed.length >= MIN_REASON && !busy;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/40 p-0 sm:items-center sm:p-4">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md overflow-y-auto overscroll-contain rounded-t-2xl bg-white p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-xl sm:rounded-2xl sm:p-6 sm:pb-6">
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-ink/15 sm:hidden" aria-hidden />
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-semibold text-ink">
              Private note to admin
            </h2>
            <p className="mt-1 text-sm text-ink-muted">
              About <span className="font-semibold text-ink">{serviceName}</span>.
              Only the playbook admin sees this — nothing is published.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-lg text-ink-soft hover:bg-foam"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <label className="block text-sm font-medium text-ink">
          What went wrong?{" "}
          <span className="font-normal text-coral">Required</span>
          <textarea
            required
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              setError("");
            }}
            rows={6}
            maxLength={MAX_REASON}
            placeholder="Please be as detailed as possible: what was agreed, what happened, when, how you tried to resolve it, amounts if relevant…"
            className="mt-1.5 w-full rounded-xl border border-ocean/15 bg-white px-3 py-2.5 text-base leading-relaxed outline-none focus:border-wave focus:ring-4 focus:ring-wave/15"
          />
          <span className="mt-1.5 flex justify-between text-xs text-ink-soft">
            <span>The more detail, the better — this stays private.</span>
            <span className="tabular-nums">
              {trimmed.length}/{MAX_REASON}
            </span>
          </span>
        </label>

        {error && <p className="mt-2 text-sm text-coral">{error}</p>}

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="min-h-12 flex-1 rounded-xl bg-foam px-4 py-2.5 text-sm font-semibold text-ink ring-1 ring-ocean/10"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!canSend}
            onClick={async () => {
              if (trimmed.length < MIN_REASON) {
                setError(
                  `Please add more detail (at least ${MIN_REASON} characters).`
                );
                return;
              }
              setBusy(true);
              try {
                await onSubmit(trimmed);
              } finally {
                setBusy(false);
              }
            }}
            className="min-h-12 flex-1 rounded-xl bg-ocean px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {busy ? "Sending…" : "Send privately"}
          </button>
        </div>
      </div>
    </div>
  );
}
