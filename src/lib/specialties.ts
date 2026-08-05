import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Armchair,
  Axe,
  Blinds,
  Bone,
  BrickWall,
  Car,
  CloudRain,
  Cross,
  DoorClosed,
  Droplets,
  Dumbbell,
  Fence,
  Hammer,
  Hand,
  Layers,
  Paintbrush,
  PanelTop,
  Refrigerator,
  ScanFace,
  Smile,
  Thermometer,
  TreePine,
  Truck,
  Zap,
} from "lucide-react";

export type SpecialtyId =
  // Cars
  | "auto_parts"
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
  | "dermatology"
  // Wood, decks, furniture & materials
  | "timber"
  | "wood_delivery"
  | "decks"
  | "carpenter"
  | "furniture"
  | "stone"
  // Gates, windows & doors
  | "gates"
  | "garage_doors"
  | "shutters"
  | "windows_doors"
  | "gutters"
  | "insulation";

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
  // —— Cars ——
  auto_parts: {
    id: "auto_parts",
    label: "Auto parts",
    short: "Parts",
    icon: Car,
    tone: "bg-blue-500/15 text-blue-900 ring-blue-500/25",
    sort_order: 20,
    groupHint: "Cars",
  },
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

  // —— Wood, decks, furniture & materials ——
  timber: {
    id: "timber",
    label: "Buy timber / wood",
    short: "Timber",
    icon: TreePine,
    tone: "bg-lime-600/15 text-lime-900 ring-lime-600/25",
    sort_order: 210,
    groupHint: "Yards & suppliers",
  },
  wood_delivery: {
    id: "wood_delivery",
    label: "Wood delivery",
    short: "Delivery",
    icon: Truck,
    tone: "bg-yellow-600/15 text-yellow-900 ring-yellow-600/25",
    sort_order: 220,
    groupHint: "Suppliers",
  },
  decks: {
    id: "decks",
    label: "Decks & outdoor wood",
    short: "Decks",
    icon: Layers,
    tone: "bg-amber-700/15 text-amber-950 ring-amber-700/25",
    sort_order: 230,
    groupHint: "Builders",
  },
  carpenter: {
    id: "carpenter",
    label: "Carpenters",
    short: "Carpenter",
    icon: Axe,
    tone: "bg-orange-700/15 text-orange-950 ring-orange-700/25",
    sort_order: 240,
    groupHint: "Craftspeople",
  },
  furniture: {
    id: "furniture",
    label: "Custom furniture",
    short: "Furniture",
    icon: Armchair,
    tone: "bg-rose-700/15 text-rose-950 ring-rose-700/25",
    sort_order: 250,
    groupHint: "Makers",
  },
  stone: {
    id: "stone",
    label: "Stone & countertops",
    short: "Stone",
    icon: BrickWall,
    tone: "bg-neutral-500/15 text-neutral-800 ring-neutral-500/30",
    sort_order: 260,
    groupHint: "Materials",
  },

  // —— Gates, windows & doors ——
  gates: {
    id: "gates",
    label: "Automatic gates",
    short: "Gates",
    icon: Fence,
    tone: "bg-slate-600/15 text-slate-900 ring-slate-600/25",
    sort_order: 310,
    groupHint: "Access",
  },
  garage_doors: {
    id: "garage_doors",
    label: "Garage doors",
    short: "Garage",
    icon: PanelTop,
    tone: "bg-zinc-600/15 text-zinc-900 ring-zinc-600/25",
    sort_order: 320,
    groupHint: "Access",
  },
  shutters: {
    id: "shutters",
    label: "Rolling shutters",
    short: "Shutters",
    icon: Blinds,
    tone: "bg-stone-600/15 text-stone-900 ring-stone-600/25",
    sort_order: 330,
    groupHint: "Openings",
  },
  windows_doors: {
    id: "windows_doors",
    label: "Windows & doors",
    short: "Windows",
    icon: DoorClosed,
    tone: "bg-blue-600/15 text-blue-950 ring-blue-600/25",
    sort_order: 340,
    groupHint: "Openings",
  },
  gutters: {
    id: "gutters",
    label: "Gutters",
    short: "Gutters",
    icon: CloudRain,
    tone: "bg-sky-700/15 text-sky-950 ring-sky-700/25",
    sort_order: 350,
    groupHint: "Exterior",
  },
  insulation: {
    id: "insulation",
    label: "Insulation",
    short: "Insulation",
    icon: Thermometer,
    tone: "bg-orange-600/15 text-orange-950 ring-orange-600/25",
    sort_order: 360,
    groupHint: "Exterior",
  },
};

export const SPECIALTY_OPTIONS = Object.values(SPECIALTIES).sort(
  (a, b) => a.sort_order - b.sort_order
);

export const CARS_SPECIALTY_IDS: SpecialtyId[] = ["auto_parts"];

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

export const WOOD_SPECIALTY_IDS: SpecialtyId[] = [
  "timber",
  "wood_delivery",
  "decks",
  "carpenter",
  "furniture",
  "stone",
];

export const OPENINGS_SPECIALTY_IDS: SpecialtyId[] = [
  "gates",
  "garage_doors",
  "shutters",
  "windows_doors",
  "gutters",
  "insulation",
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
