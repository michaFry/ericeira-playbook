"use client";

import { getSpecialty } from "@/lib/specialties";

export function SpecialtyBadge({
  specialty,
  size = "md",
}: {
  specialty: string | null | undefined;
  size?: "sm" | "md" | "lg";
}) {
  const def = getSpecialty(specialty);
  if (!def) return null;
  const Icon = def.icon;

  const sizes =
    size === "lg"
      ? {
          wrap: "gap-2 rounded-xl px-3 py-2 text-sm",
          iconWrap: "h-8 w-8 rounded-lg",
          icon: "h-4 w-4",
        }
      : size === "sm"
        ? {
            wrap: "gap-1.5 rounded-lg px-2 py-1 text-[0.7rem]",
            iconWrap: "h-5 w-5 rounded-md",
            icon: "h-3 w-3",
          }
        : {
            wrap: "gap-1.5 rounded-xl px-2.5 py-1.5 text-xs",
            iconWrap: "h-6 w-6 rounded-lg",
            icon: "h-3.5 w-3.5",
          };

  return (
    <span
      className={`inline-flex items-center font-bold ring-1 ${def.tone} ${sizes.wrap}`}
    >
      <span
        className={`inline-flex items-center justify-center bg-white/70 ${sizes.iconWrap}`}
      >
        <Icon className={sizes.icon} aria-hidden />
      </span>
      {def.short}
    </span>
  );
}

export function SpecialtyGroupHeader({
  specialty,
}: {
  specialty: string | null | undefined;
}) {
  const def = getSpecialty(specialty);
  if (!def) {
    return (
      <p className="mb-2 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-ink-soft">
        Other
      </p>
    );
  }
  const Icon = def.icon;
  return (
    <div className="mb-2 flex items-center gap-2.5">
      <span
        className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ring-1 ${def.tone}`}
      >
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <div>
        <p className="font-display text-base font-semibold tracking-tight text-ink">
          {def.label}
        </p>
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-ink-soft">
          {def.groupHint || "Specialty"}
        </p>
      </div>
    </div>
  );
}
