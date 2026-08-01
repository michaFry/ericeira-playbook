import { getSpecialty, SPECIALTY_OPTIONS } from "@/lib/specialties";
import type { ServiceWithCategory } from "@/lib/types";

export type SpecialtyGroup = {
  key: string;
  specialty: string;
  services: ServiceWithCategory[];
};

/** Group contacts by specialty. Groups and items ordered by votes (desc). */
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

  const knownOrder = new Map(
    SPECIALTY_OPTIONS.map((def, index) => [def.id, index])
  );

  const groups: SpecialtyGroup[] = [];
  for (const [key, list] of buckets) {
    groups.push({
      key,
      specialty: key === "other" ? "" : key,
      services: byVotes(list),
    });
  }

  groups.sort((a, b) => {
    const aTop = a.services[0]?.votes || 0;
    const bTop = b.services[0]?.votes || 0;
    if (bTop !== aTop) return bTop - aTop;
    const aIdx = knownOrder.get(a.key) ?? 999;
    const bIdx = knownOrder.get(b.key) ?? 999;
    if (aIdx !== bIdx) return aIdx - bIdx;
    return a.key.localeCompare(b.key);
  });

  return groups;
}

export function specialtySortLabel(specialty: string): string {
  return getSpecialty(specialty)?.label || "Other";
}
