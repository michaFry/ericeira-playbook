"use client";

import { MapPin, MousePointerClick, Phone } from "lucide-react";
import type { ServiceClickStats } from "@/lib/types";

export function ClicksAdmin({ stats }: { stats: ServiceClickStats[] }) {
  const top = stats.slice(0, 10);
  const totalAll = stats.reduce((n, s) => n + s.total_clicks, 0);

  if (top.length === 0) {
    return (
      <p className="rounded-2xl bg-white/70 p-8 text-center text-ink/50">
        No clicks yet. When someone taps a phone number or address on the
        playbook, it shows up here.
      </p>
    );
  }

  const max = Math.max(...top.map((s) => s.total_clicks), 1);

  return (
    <section className="space-y-4">
      <p className="rounded-xl bg-foam px-4 py-3 text-sm text-ink-muted ring-1 ring-ocean/10">
        Top 10 most clicked contacts · {totalAll} tracked click
        {totalAll === 1 ? "" : "s"} total (phone, address, email, link).
      </p>

      <ol className="space-y-3">
        {top.map((item, index) => {
          const pct = Math.round((item.total_clicks / max) * 100);
          return (
            <li
              key={item.service_id}
              className="rounded-2xl border border-ocean/10 bg-white p-4 shadow-sm sm:p-5"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-ocean/10 font-display text-sm font-bold text-ocean">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-ocean">
                    {item.category_name}
                    {item.status !== "approved" && (
                      <span className="ml-2 text-coral">· {item.status}</span>
                    )}
                  </p>
                  <h3 className="font-display text-lg font-semibold text-ink">
                    {item.service_name}
                  </h3>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-foam">
                    <div
                      className="h-full rounded-full bg-ocean"
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-semibold">
                    <span className="inline-flex items-center gap-1 rounded-lg bg-ocean/10 px-2 py-1 text-ocean">
                      <MousePointerClick className="h-3.5 w-3.5" />
                      {item.total_clicks} total
                    </span>
                    {item.phone_clicks > 0 && (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-foam px-2 py-1 text-ink-muted ring-1 ring-ocean/10">
                        <Phone className="h-3.5 w-3.5" />
                        {item.phone_clicks} phone
                      </span>
                    )}
                    {item.address_clicks > 0 && (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-foam px-2 py-1 text-ink-muted ring-1 ring-ocean/10">
                        <MapPin className="h-3.5 w-3.5" />
                        {item.address_clicks} address
                      </span>
                    )}
                    {item.email_clicks > 0 && (
                      <span className="rounded-lg bg-foam px-2 py-1 text-ink-muted ring-1 ring-ocean/10">
                        {item.email_clicks} email
                      </span>
                    )}
                    {item.url_clicks > 0 && (
                      <span className="rounded-lg bg-foam px-2 py-1 text-ink-muted ring-1 ring-ocean/10">
                        {item.url_clicks} link
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
