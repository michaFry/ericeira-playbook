"use client";

import { useId, useState } from "react";
import {
  ChevronDown,
  ExternalLink,
  ListOrdered,
  Mail,
  Phone,
} from "lucide-react";
import { LanguageFlags } from "./LanguageFlags";
import { toMailtoHref } from "@/lib/email";
import { toTelHref } from "@/lib/phone";
import { parseSteps } from "@/lib/steps";
import { trackClick } from "@/lib/track-click";
import type { ServiceWithCategory } from "@/lib/types";

export function ProcedureCard({
  service,
  highlight,
  defaultOpen = false,
}: {
  service: ServiceWithCategory;
  highlight?: boolean;
  defaultOpen?: boolean;
}) {
  const steps = parseSteps(service.steps);
  const phoneHref = service.phone ? toTelHref(service.phone) : null;
  const mailHref = toMailtoHref(service.email);
  const panelId = useId();
  const [open, setOpen] = useState(defaultOpen || Boolean(highlight));

  return (
    <li
      className={`border-b border-ocean/10 last:border-b-0 ${
        highlight ? "bg-sun/8" : ""
      }`}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="pressable flex w-full items-start gap-2.5 px-3.5 py-3 text-left sm:px-4 sm:py-3"
      >
        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-ocean/10 text-ocean">
          <ListOrdered className="h-3.5 w-3.5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-ocean">
              How-to
            </span>
            <LanguageFlags languages={service.languages} />
          </span>
          <span className="mt-0.5 block font-display text-[0.95rem] font-semibold leading-snug tracking-tight text-ink sm:text-base">
            {service.name}
          </span>
          {!open && service.details && (
            <span className="mt-0.5 line-clamp-1 block text-xs text-ink-muted">
              {service.details}
            </span>
          )}
          {!open && steps.length > 0 && (
            <span className="mt-0.5 block text-[0.7rem] font-medium text-ink-soft">
              {steps.length} step{steps.length === 1 ? "" : "s"}
            </span>
          )}
        </span>
        <ChevronDown
          className={`mt-1 h-4 w-4 shrink-0 text-ink-soft transition ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden
        />
      </button>

      {open && (
        <div id={panelId} className="px-3.5 pb-4 sm:px-4 sm:pl-[3.25rem]">
          {service.details && (
            <p className="text-sm leading-relaxed text-ink-muted text-pretty">
              {service.details}
            </p>
          )}

          {steps.length > 0 && (
            <ol className="mt-3 space-y-2.5 border-l-2 border-ocean/20 pl-4">
              {steps.map((step, i) => (
                <li key={i} className="relative">
                  <span
                    className="absolute -left-[1.35rem] top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-ocean text-[0.6rem] font-bold text-white"
                    aria-hidden
                  >
                    {i + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-ink text-pretty">
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          )}

          {(phoneHref || service.email || service.url) && (
            <div className="mt-3 flex flex-wrap gap-2">
              {phoneHref && (
                <a
                  href={phoneHref}
                  onClick={() => trackClick(service.id, "phone")}
                  className="pressable inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-foam px-2.5 py-1.5 text-xs font-semibold text-ocean ring-1 ring-ocean/15"
                  aria-label={`Call ${service.phone}`}
                  title={`Call ${service.phone}`}
                >
                  <Phone className="h-3.5 w-3.5" aria-hidden />
                  {service.phone}
                </a>
              )}
              {mailHref && (
                <a
                  href={mailHref}
                  onClick={() => trackClick(service.id, "email")}
                  className="pressable inline-flex min-h-10 max-w-full items-center gap-1.5 rounded-lg bg-foam px-2.5 py-1.5 text-xs font-semibold text-ocean ring-1 ring-ocean/15"
                  title={service.email || undefined}
                >
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{service.email}</span>
                </a>
              )}
              {service.url && (
                <a
                  href={service.url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackClick(service.id, "url")}
                  className="pressable inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-foam px-2.5 py-1.5 text-xs font-semibold text-ocean ring-1 ring-ocean/15"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Open link
                </a>
              )}
            </div>
          )}
        </div>
      )}
    </li>
  );
}
