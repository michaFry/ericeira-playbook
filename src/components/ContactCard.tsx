"use client";

import { ExternalLink, Flag, Mail, MapPin, Phone, ThumbsUp } from "lucide-react";
import { GoogleSnapshot } from "./GoogleSnapshot";
import { LanguageFlags } from "./LanguageFlags";
import { SpecialtyBadge } from "./SpecialtyBadge";
import { mapsSearchUrl } from "@/lib/maps";
import { toTelHref } from "@/lib/phone";
import { trackClick } from "@/lib/track-click";
import type { ServiceWithCategory } from "@/lib/types";

export function ContactCard({
  service,
  highlight,
  isVoted,
  isReported,
  showSpecialtyBadge,
  onVote,
  onReport,
}: {
  service: ServiceWithCategory;
  highlight?: boolean;
  isVoted: boolean;
  isReported: boolean;
  showSpecialtyBadge?: boolean;
  onVote: () => void;
  onReport: () => void;
}) {
  const phoneHref = service.phone ? toTelHref(service.phone) : null;

  return (
    <li
      className={`px-3.5 py-4 transition sm:px-5 ${
        highlight ? "bg-sun/8" : "hover:bg-foam"
      }`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          {showSpecialtyBadge && service.specialty && (
            <div className="mb-2.5">
              <SpecialtyBadge specialty={service.specialty} size="lg" />
            </div>
          )}
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <h3 className="text-base font-bold text-ink">{service.name}</h3>
            <LanguageFlags languages={service.languages} />
          </div>
          {service.details && (
            <p className="mt-1 text-sm leading-relaxed text-ink-muted text-pretty">
              {service.details}
            </p>
          )}
          <GoogleSnapshot
            rating={service.rating}
            reviewsCount={service.reviews_count}
            hours={service.hours}
            note={service.google_note}
          />
          <div className="mt-2.5 flex flex-wrap gap-2">
            {service.address && (
              <a
                href={mapsSearchUrl(service.address)}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackClick(service.id, "address")}
                className="pressable inline-flex min-h-11 max-w-full items-center gap-1.5 rounded-lg bg-foam px-3 py-2 text-xs font-semibold text-ocean ring-1 ring-ocean/15 sm:min-h-0 sm:px-2.5 sm:py-1.5"
                title="Open in Google Maps"
              >
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{service.address}</span>
              </a>
            )}
            {phoneHref && (
              <a
                href={phoneHref}
                onClick={() => trackClick(service.id, "phone")}
                className="pressable inline-flex min-h-11 items-center gap-1.5 rounded-lg bg-foam px-3 py-2 text-xs font-semibold text-ocean ring-1 ring-ocean/15 sm:min-h-0 sm:px-2.5 sm:py-1.5"
                aria-label={`Call ${service.phone}`}
                title={`Call ${service.phone}`}
              >
                <Phone className="h-3.5 w-3.5" aria-hidden />
                {service.phone}
              </a>
            )}
            {service.email && (
              <a
                href={`mailto:${service.email}`}
                onClick={() => trackClick(service.id, "email")}
                className="pressable inline-flex min-h-11 items-center gap-1.5 rounded-lg bg-foam px-3 py-2 text-xs font-semibold text-ocean ring-1 ring-ocean/15 sm:min-h-0 sm:px-2.5 sm:py-1.5"
              >
                <Mail className="h-3.5 w-3.5" />
                Email
              </a>
            )}
            {service.url && (
              <a
                href={service.url}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackClick(service.id, "url")}
                className="pressable inline-flex min-h-11 items-center gap-1.5 rounded-lg bg-foam px-3 py-2 text-xs font-semibold text-ocean ring-1 ring-ocean/15 sm:min-h-0 sm:px-2.5 sm:py-1.5"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Link
              </a>
            )}
          </div>
        </div>

        <div className="flex shrink-0 flex-row items-center gap-2 border-t border-ocean/10 pt-3 sm:flex-col sm:border-t-0 sm:pt-0">
          <button
            type="button"
            onClick={onVote}
            className={`pressable inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold tabular-nums sm:min-w-11 sm:flex-none sm:flex-col sm:gap-0 ${
              isVoted
                ? "bg-ocean text-white"
                : "bg-foam text-ocean hover:bg-ocean/10"
            }`}
            aria-label="Vote for this tip"
            aria-pressed={isVoted}
          >
            <ThumbsUp className="h-4 w-4" />
            <span>{service.votes}</span>
          </button>
          <button
            type="button"
            disabled={isReported}
            onClick={onReport}
            className={`pressable flex min-h-11 min-w-11 items-center justify-center rounded-xl sm:rounded-lg ${
              isReported
                ? "cursor-default text-ink-soft/50"
                : "bg-foam text-ink-soft hover:text-coral sm:bg-transparent"
            }`}
            title={
              isReported ? "Already sent privately" : "Private note to admin"
            }
            aria-label={
              isReported
                ? "Already reported privately"
                : "Send private feedback to admin"
            }
          >
            <Flag className="h-4 w-4" />
          </button>
        </div>
      </div>
    </li>
  );
}
