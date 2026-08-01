import { getSpecialty, SPECIALTY_OPTIONS } from "@/lib/specialties";
import type { ServiceWithCategory } from "@/lib/types";

export type SpecialtyGroup = {
  key: string;
  specialty: string;
  services: ServiceWithCategory[];
};

/** Group contacts by specialty (ordered). Empty specialty → "other" at end. */
export function groupContactsBySpecialty(
  contacts: ServiceWithCategory[]
): SpecialtyGroup[] {
  const hasAny = contacts.some((s) => Boolean(s.specialty));
  if (!hasAny) {
    return [{ key: "all", specialty: "", services: contacts }];
  }

  const buckets = new Map<string, ServiceWithCategory[]>();
  for (const s of contacts) {
    const key = s.specialty || "other";
    const list = buckets.get(key) || [];
    list.push(s);
    buckets.set(key, list);
  }

  const groups: SpecialtyGroup[] = [];
  for (const def of SPECIALTY_OPTIONS) {
    const list = buckets.get(def.id);
    if (list?.length) {
      groups.push({ key: def.id, specialty: def.id, services: list });
      buckets.delete(def.id);
    }
  }
  for (const [key, list] of buckets) {
    groups.push({ key, specialty: key === "other" ? "" : key, services: list });
  }
  return groups;
}

export function specialtySortLabel(specialty: string): string {
  return getSpecialty(specialty)?.label || "Other";
}
