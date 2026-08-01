import type { ServiceKind } from "./types";

export function parseSteps(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.map((s) => String(s).trim()).filter(Boolean);
    }
  } catch {
    // fallback: newline / semicolon separated
  }
  return value
    .split(/\n|;/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function serializeSteps(steps: string[]): string {
  return JSON.stringify(steps.map((s) => s.trim()).filter(Boolean));
}

export function isProcedure(kind: string | null | undefined): boolean {
  return kind === "procedure";
}

export function normalizeKind(value: unknown): ServiceKind {
  return value === "procedure" ? "procedure" : "contact";
}
