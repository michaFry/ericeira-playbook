"use client";

import { useState, type ComponentProps } from "react";
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Flag,
  Mail,
  MapPin,
  MessageSquareText,
  Phone,
  ThumbsUp,
} from "lucide-react";
import { GoogleSnapshot } from "./GoogleSnapshot";
import { LanguageFlags } from "./LanguageFlags";
import { SpecialtyBadge } from "./SpecialtyBadge";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { cn } from "@/lib/cn";
import { mapsSearchUrl } from "@/lib/maps";
import { toMailtoHref } from "@/lib/email";
import { toTelHref, toWhatsAppHref } from "@/lib/phone";
import { trackClick } from "@/lib/track-click";
import type { ServiceWithCategory, VoteNotePublic } from "@/lib/types";

function ActionChip({
  className,
  ...props
}: ComponentProps<"a"> & { className?: string }) {
  return (
    <a
      {...props}
      className={cn("pressable chip chip-neutral", className)}
    />
  );
}

export function ContactCard({
  service,
  highlight,
  isVoted,
  isReported,
  showSpecialtyBadge,
  notes = [],
  onVote,
  onReport,
}: {
  service: ServiceWithCategory;
  highlight?: boolean;
  isVoted: boolean;
  isReported: boolean;
  showSpecialtyBadge?: boolean;
  notes?: VoteNotePublic[];
  onVote: () => void;
  onReport: () => void;
}) {
  const [notesOpen, setNotesOpen] = useState(false);
  const phoneHref = service.phone ? toTelHref(service.phone) : null;
  const whatsappHref = service.phone ? toWhatsAppHref(service.phone) : null;
  const mailHref = toMailtoHref(service.email);
  const hasDirectContact = Boolean(phoneHref || whatsappHref || mailHref);
  const hasSecondary = Boolean(service.address || service.url);

  return (
    <li
      className={cn(
        "px-3.5 py-4 transition sm:px-5",
        highlight ? "bg-sun/8" : "hover:bg-foam/80"
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          {showSpecialtyBadge && service.specialty && (
            <div className="mb-2.5">
              <SpecialtyBadge specialty={service.specialty} size="lg" />
            </div>
          )}
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <h3 className="text-base font-bold text-balance text-ink">
              {service.name}
            </h3>
            <LanguageFlags languages={service.languages} />
          </div>
          {service.details && (
            <p className="mt-1 text-sm leading-relaxed text-ink-muted text-pretty">
              {service.details}
            </p>
          )}

          {notes.length > 0 && (
            <div className="mt-2.5">
              <button
                type="button"
                onClick={() => setNotesOpen((v) => !v)}
                className="pressable inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-sun/15 px-2.5 py-1.5 text-xs font-semibold text-ocean-deep ring-1 ring-sun/30"
                aria-expanded={notesOpen}
              >
                <MessageSquareText className="size-3.5" aria-hidden />
                <span className="tabular-nums">{notes.length}</span>
                <span>
                  tip note{notes.length === 1 ? "" : "s"}
                </span>
                {notesOpen ? (
                  <ChevronUp className="size-3.5" aria-hidden />
                ) : (
                  <ChevronDown className="size-3.5" aria-hidden />
                )}
              </button>
              {notesOpen && (
                <ul className="mt-2 space-y-1.5 rounded-xl bg-foam/80 px-3 py-2.5 ring-1 ring-ocean/10">
                  {notes.map((n) => (
                    <li
                      key={n.id}
                      className="text-sm leading-snug text-ink-muted text-pretty"
                    >
                      <span className="text-ocean/40">&ldquo;</span>
                      {n.body}
                      <span className="text-ocean/40">&rdquo;</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <GoogleSnapshot
            rating={service.rating}
            reviewsCount={service.reviews_count}
            hours={service.hours}
            note={service.google_note}
          />

          {(hasDirectContact || hasSecondary) && (
            <div className="mt-3 space-y-2">
              {hasDirectContact && (
                <div className="flex flex-wrap gap-2">
                  {phoneHref && (
                    <ActionChip
                      href={phoneHref}
                      onClick={() => trackClick(service.id, "phone")}
                      aria-label={`Call ${service.phone}`}
                      title={`Call ${service.phone}`}
                    >
                      <Phone className="size-3.5 shrink-0" aria-hidden />
                      <span className="tabular-nums">{service.phone}</span>
                    </ActionChip>
                  )}
                  {whatsappHref && (
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => trackClick(service.id, "whatsapp")}
                      className="pressable chip chip-whatsapp"
                      aria-label={`WhatsApp ${service.phone}`}
                      title={`WhatsApp ${service.phone}`}
                    >
                      <WhatsAppIcon className="size-3.5 shrink-0" />
                      WhatsApp
                    </a>
                  )}
                  {mailHref && (
                    <ActionChip
                      href={mailHref}
                      className="chip-max"
                      onClick={() => {
                        trackClick(service.id, "email");
                        try {
                          void navigator.clipboard?.writeText(
                            mailHref.replace(/^mailto:/i, "")
                          );
                        } catch {
                          // ignore clipboard failures
                        }
                      }}
                      title={`${service.email} (copied on click)`}
                    >
                      <Mail className="size-3.5 shrink-0" aria-hidden />
                      <span className="truncate">{service.email}</span>
                    </ActionChip>
                  )}
                </div>
              )}
              {hasSecondary && (
                <div className="flex flex-wrap gap-2">
                  {service.address && (
                    <ActionChip
                      href={mapsSearchUrl(service.address)}
                      target="_blank"
                      rel="noreferrer"
                      className="chip-max"
                      onClick={() => trackClick(service.id, "address")}
                      title="Open in Google Maps"
                    >
                      <MapPin className="size-3.5 shrink-0" aria-hidden />
                      <span className="truncate">{service.address}</span>
                    </ActionChip>
                  )}
                  {service.url && (
                    <ActionChip
                      href={service.url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => trackClick(service.id, "url")}
                    >
                      <ExternalLink className="size-3.5 shrink-0" aria-hidden />
                      Link
                    </ActionChip>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex shrink-0 flex-row items-center gap-2 border-t border-ocean/10 pt-3 sm:flex-col sm:border-t-0 sm:pt-0">
          <button
            type="button"
            onClick={onVote}
            className={cn(
              "pressable inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold tabular-nums sm:min-w-11 sm:flex-none sm:flex-col sm:gap-0.5",
              isVoted
                ? "bg-ocean text-white shadow-sm"
                : "bg-foam text-ocean ring-1 ring-ocean/12 hover:bg-ocean/8"
            )}
            aria-label="Vote for this tip"
            aria-pressed={isVoted}
          >
            <ThumbsUp className="size-4" aria-hidden />
            <span>{service.votes}</span>
          </button>
          <button
            type="button"
            disabled={isReported}
            onClick={onReport}
            className={cn(
              "pressable flex size-11 items-center justify-center rounded-xl sm:rounded-lg",
              isReported
                ? "cursor-default text-ink-soft/50"
                : "bg-foam text-ink-soft ring-1 ring-ocean/10 hover:text-coral sm:bg-transparent sm:ring-0"
            )}
            title={
              isReported ? "Already sent privately" : "Private note to admin"
            }
            aria-label={
              isReported
                ? "Already reported privately"
                : "Send private feedback to admin"
            }
          >
            <Flag className="size-4" aria-hidden />
          </button>
        </div>
      </div>
    </li>
  );
}
