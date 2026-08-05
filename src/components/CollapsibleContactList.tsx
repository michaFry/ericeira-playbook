"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ContactCard } from "./ContactCard";
import type { ServiceWithCategory, VoteNotePublic } from "@/lib/types";

const PREVIEW_LIMIT = 4;

/** Shows the top N contacts; expands on “See more”. */
export function CollapsibleContactList({
  services,
  highlight,
  voted,
  reported,
  notesByService,
  showSpecialtyBadge,
  onVote,
  onReport,
  limit = PREVIEW_LIMIT,
}: {
  services: ServiceWithCategory[];
  highlight?: boolean;
  voted: Set<string>;
  reported: Set<string>;
  notesByService: Record<string, VoteNotePublic[]>;
  showSpecialtyBadge?: boolean;
  onVote: (id: string) => void;
  onReport: (service: ServiceWithCategory) => void;
  limit?: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const needsCollapse = services.length > limit;
  const visible =
    expanded || !needsCollapse ? services : services.slice(0, limit);
  const hiddenCount = services.length - limit;

  return (
    <div>
      <ul className="surface-card divide-y divide-ocean/10">
        {visible.map((service) => (
          <ContactCard
            key={service.id}
            service={service}
            highlight={highlight}
            isVoted={voted.has(service.id)}
            isReported={reported.has(service.id)}
            showSpecialtyBadge={showSpecialtyBadge}
            notes={notesByService[service.id] || []}
            onVote={() => onVote(service.id)}
            onReport={() => onReport(service)}
          />
        ))}
      </ul>
      {needsCollapse && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="pressable mt-2 inline-flex min-h-11 w-full items-center justify-center gap-1.5 rounded-xl bg-foam px-3 py-2.5 text-sm font-semibold text-ocean ring-1 ring-ocean/12 sm:min-h-0"
          aria-expanded={expanded}
        >
          {expanded ? (
            <>
              <ChevronUp className="h-4 w-4" aria-hidden />
              Show less
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4" aria-hidden />
              See more ({hiddenCount})
            </>
          )}
        </button>
      )}
    </div>
  );
}
