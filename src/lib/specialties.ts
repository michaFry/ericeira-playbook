import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Bone,
  Cross,
  Droplets,
  Dumbbell,
  Hammer,
  Hand,
  Paintbrush,
  Refrigerator,
  ScanFace,
  Smile,
  Zap,
} from "lucide-react";

export type SpecialtyId =
  // Trades
  | "electrician"
  | "plumber"
  | "painter"
  | "metal"
  | "appliances"
  // Health & bodywork
  | "dental"
  | "chiropractic"
  | "physio"
  | "osteopathy"
  | "training"
  | "nursing"
  | "dermatology";

export type SpecialtyDef = {
  id: SpecialtyId;
  label: string;
  /** Short label for compact badges */
  short: string;
  icon: LucideIcon;
  /** Tailwind classes for the badge / group chip */
  tone: string;
  sort_order: number;
  /** Optional group label under the title */
  groupHint?: string;
};

export const SPECIALTIES: Record<SpecialtyId, SpecialtyDef> = {
  // —— Trades ——
  electrician: {
    id: "electrician",
    label: "Electrician",
    short: "Electrician",
    icon: Zap,
    tone: "bg-amber-500/15 text-amber-800 ring-amber-500/25",
    sort_order: 110,
  },
  plumber: {
    id: "plumber",
    label: "Plumber",
    short: "Plumber",
    icon: Droplets,
    tone: "bg-sky-500/15 text-sky-800 ring-sky-500/25",
    sort_order: 120,
  },
  painter: {
    id: "painter",
    label: "Painter",
    short: "Painter",
    icon: Paintbrush,
    tone: "bg-violet-500/15 text-violet-800 ring-violet-500/25",
    sort_order: 130,
  },
  metal: {
    id: "metal",
    label: "Metal / welding",
    short: "Metal",
    icon: Hammer,
    tone: "bg-stone-500/15 text-stone-800 ring-stone-500/30",
    sort_order: 140,
  },
  appliances: {
    id: "appliances",
    label: "Appliance repair",
    short: "Appliances",
    icon: Refrigerator,
    tone: "bg-teal-500/15 text-teal-800 ring-teal-500/25",
    sort_order: 150,
  },

  // —— Health (clinics first, then people by craft) ——
  dental: {
    id: "dental",
    label: "Dental clinics",
    short: "Dental",
    icon: Smile,
    tone: "bg-cyan-500/15 text-cyan-900 ring-cyan-500/25",
    sort_order: 10,
    groupHint: "Clinics",
  },
  chiropractic: {
    id: "chiropractic",
    label: "Chiropractic",
    short: "Chiro",
    icon: Bone,
    tone: "bg-rose-500/15 text-rose-900 ring-rose-500/25",
    sort_order: 20,
    groupHint: "Clinics & practitioners",
  },
  physio: {
    id: "physio",
    label: "Physio & mobility",
    short: "Physio",
    icon: Activity,
    tone: "bg-emerald-500/15 text-emerald-900 ring-emerald-500/25",
    sort_order: 30,
    groupHint: "Individuals",
  },
  osteopathy: {
    id: "osteopathy",
    label: "Osteopathy",
    short: "Osteo",
    icon: Hand,
    tone: "bg-orange-500/15 text-orange-900 ring-orange-500/25",
    sort_order: 40,
    groupHint: "Individuals",
  },
  training: {
    id: "training",
    label: "Personal training",
    short: "Training",
    icon: Dumbbell,
    tone: "bg-indigo-500/15 text-indigo-900 ring-indigo-500/25",
    sort_order: 50,
    groupHint: "Individuals",
  },
  nursing: {
    id: "nursing",
    label: "Nursing",
    short: "Nurse",
    icon: Cross,
    tone: "bg-red-500/15 text-red-900 ring-red-500/25",
    sort_order: 60,
    groupHint: "Individuals",
  },
  dermatology: {
    id: "dermatology",
    label: "Dermatology",
    short: "Derm",
    icon: ScanFace,
    tone: "bg-fuchsia-500/15 text-fuchsia-900 ring-fuchsia-500/25",
    sort_order: 70,
    groupHint: "Individuals",
  },
};

export const SPECIALTY_OPTIONS = Object.values(SPECIALTIES).sort(
  (a, b) => a.sort_order - b.sort_order
);

export const TRADE_SPECIALTY_IDS: SpecialtyId[] = [
  "electrician",
  "plumber",
  "painter",
  "metal",
  "appliances",
];

export const HEALTH_SPECIALTY_IDS: SpecialtyId[] = [
  "dental",
  "chiropractic",
  "physio",
  "osteopathy",
  "training",
  "nursing",
  "dermatology",
];

export function getSpecialty(
  id: string | null | undefined
): SpecialtyDef | null {
  if (!id) return null;
  return SPECIALTIES[id as SpecialtyId] ?? null;
}

export function normalizeSpecialty(
  value: string | null | undefined
): SpecialtyId | "" {
  if (!value) return "";
  return value in SPECIALTIES ? (value as SpecialtyId) : "";
}
