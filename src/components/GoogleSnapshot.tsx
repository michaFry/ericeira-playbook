"use client";

import { Clock, Star } from "lucide-react";

export function GoogleSnapshot({
  rating,
  reviewsCount,
  hours,
  note,
}: {
  rating: number | null;
  reviewsCount: number;
  hours: string;
  note: string;
}) {
  const hasRating = rating != null && rating > 0;
  if (!hasRating && !hours && !note) return null;

  return (
    <div className="mt-3 rounded-xl bg-foam px-3.5 py-3 ring-1 ring-ocean/15">
      <p className="mb-2 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-ocean">
        Listing snapshot
      </p>
      {hasRating && (
        <div className="mb-1.5 flex items-center gap-1.5 text-sm font-bold text-ink">
          <Star className="h-4 w-4 fill-sun text-sun" />
          <span>{Number(rating).toFixed(1)}</span>
          {reviewsCount > 0 && (
            <span className="font-semibold text-ink-soft">
              · {reviewsCount} reviews
            </span>
          )}
        </div>
      )}
      {hours && (
        <p className="mb-1.5 flex items-start gap-1.5 text-sm font-semibold text-ink">
          <Clock className="mt-0.5 h-4 w-4 shrink-0 text-ocean" />
          <span>{hours}</span>
        </p>
      )}
      {note && (
        <p className="text-sm leading-relaxed text-ink-muted">{note}</p>
      )}
    </div>
  );
}
