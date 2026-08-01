"use client";

import { REPORT_AUTO_HIDE_AFTER } from "@/lib/reports";
import type { ServiceReportSummary } from "@/lib/types";

export function ReportsAdmin({
  reports,
  onAction,
}: {
  reports: ServiceReportSummary[];
  onAction: (payload: Record<string, unknown>) => Promise<void>;
}) {
  if (reports.length === 0) {
    return (
      <p className="rounded-2xl bg-white/70 p-8 text-center text-ink/50">
        No private feedback yet. When someone flags a tip, it shows up here —
        never on the public playbook.
      </p>
    );
  }

  return (
    <section className="space-y-4">
      <p className="rounded-xl bg-foam px-4 py-3 text-sm text-ink-muted ring-1 ring-ocean/10">
        Private only. Contacts with more than {REPORT_AUTO_HIDE_AFTER} private
        notes are auto-hidden from the playbook (kept in the database). You can
        still restore or clear notes here — no public trail.
      </p>
      {reports.map((item) => {
        const hot = item.report_count > REPORT_AUTO_HIDE_AFTER;
        const hidden = item.status === "hidden";
        return (
          <article
            key={item.service_id}
            className={`rounded-2xl border bg-white p-5 shadow-sm ${
              hot || hidden ? "border-coral/40" : "border-ocean/10"
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-ocean">
                  {item.category_name}
                  {hidden && (
                    <span className="ml-2 text-coral">· hidden</span>
                  )}
                </p>
                <h3 className="font-display text-xl font-semibold">
                  {item.service_name}
                </h3>
                <p
                  className={`mt-1 text-sm font-semibold ${
                    hot || hidden ? "text-coral" : "text-ink-muted"
                  }`}
                >
                  {item.report_count} private note
                  {item.report_count === 1 ? "" : "s"}
                  {hidden
                    ? " — unpublished"
                    : hot
                      ? " — auto-hide threshold reached"
                      : ""}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {hidden ? (
                  <button
                    type="button"
                    onClick={() =>
                      onAction({
                        action: "setStatus",
                        id: item.service_id,
                        status: "approved",
                      })
                    }
                    className="rounded-xl bg-wave px-3 py-2 text-sm font-semibold text-white"
                  >
                    Restore
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (
                        confirm(
                          `Hide “${item.service_name}” from the public playbook? It won’t appear in search or lists.`
                        )
                      ) {
                        onAction({
                          action: "setStatus",
                          id: item.service_id,
                          status: "hidden",
                        });
                      }
                    }}
                    className="rounded-xl bg-coral/90 px-3 py-2 text-sm font-semibold text-white"
                  >
                    Hide quietly
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Clear all private notes for this tip?")) {
                      onAction({
                        action: "clearReports",
                        id: item.service_id,
                      });
                    }
                  }}
                  className="rounded-xl bg-foam px-3 py-2 text-sm font-semibold text-ink ring-1 ring-ocean/10"
                >
                  Clear notes
                </button>
              </div>
            </div>
            <ul className="mt-4 space-y-2 border-t border-ocean/10 pt-3">
              {item.reports.map((r) => (
                <li key={r.id} className="text-sm text-ink-muted">
                  <span className="text-xs text-ink-soft">
                    {new Date(r.created_at).toLocaleString()}
                  </span>
                  <p className="mt-0.5 text-ink">
                    {r.reason || (
                      <span className="italic text-ink-soft">
                        (no details given)
                      </span>
                    )}
                  </p>
                </li>
              ))}
            </ul>
          </article>
        );
      })}
    </section>
  );
}
