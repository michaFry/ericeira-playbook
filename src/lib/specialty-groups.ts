import { getSpecialty, SPECIALTY_OPTIONS } from "@/lib/specialties";
import type { ServiceWithCategory } from "@/lib/types";

export type SpecialtyGroup = {
  key: string;
  specialty: string;
  services: ServiceWithCategory[];
};

/** Prefer specialty taxonomy order within a category; then by votes. */
export function groupContactsBySpecialty(
  contacts: ServiceWithCategory[]
): SpecialtyGroup[] {
  const byVotes = (list: ServiceWithCategory[]) =>
    [...list].sort(
      (a, b) =>
        (b.votes || 0) - (a.votes || 0) ||
        a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
    );

  const hasAny = contacts.some((s) => Boolean(s.specialty));
  if (!hasAny) {
    return [{ key: "all", specialty: "", services: byVotes(contacts) }];
  }

  const buckets = new Map<string, ServiceWithCategory[]>();
  for (const s of contacts) {
    const key = s.specialty || "other";
    const list = buckets.get(key) || [];
    list.push(s);
    buckets.set(key, list);
  }

  const knownOrder = new Map<string, number>(
    SPECIALTY_OPTIONS.map((def) => [def.id, def.sort_order])
  );

  const groups: SpecialtyGroup[] = [];
  for (const [key, list] of buckets) {
    groups.push({
      key,
      specialty: key === "other" ? "" : key,
      services: byVotes(list),
    });
  }

  // Specialty groups in taxonomy order (timber → delivery → decks → …),
  // not by top votes — keeps wood/trades/health sections readable.
  groups.sort((a, b) => {
    const aIdx = knownOrder.get(a.key) ?? 9999;
    const bIdx = knownOrder.get(b.key) ?? 9999;
    if (aIdx !== bIdx) return aIdx - bIdx;
    return a.key.localeCompare(b.key);
  });

  return groups;
}

export function specialtySortLabel(specialty: string): string {
  return getSpecialty(specialty)?.label || "Other";
}
