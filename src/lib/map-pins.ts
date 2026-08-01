import { withinEriceiraRadius } from "@/lib/geo";
import type { ServiceWithCategory } from "@/lib/types";

export type MapPin = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  categoryId: string;
  categoryName: string;
  details?: string;
};

export function servicesToMapPins(
  services: ServiceWithCategory[],
  categoryId?: string | null
): MapPin[] {
  return services
    .filter((s) => {
      if (s.kind === "procedure") return false;
      if (s.lat == null || s.lng == null) return false;
      if (!withinEriceiraRadius(s.lat, s.lng)) return false;
      if (categoryId && s.category_id !== categoryId) return false;
      return true;
    })
    .map((s) => ({
      id: s.id,
      name: s.name,
      lat: s.lat as number,
      lng: s.lng as number,
      categoryId: s.category_id,
      categoryName: s.category_name,
      details: s.details || undefined,
    }));
}
