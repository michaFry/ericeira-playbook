export type LangCode = "pt" | "en" | "fr" | "nl" | "hu" | "de" | "es";

export const LANG_META: Record<
  LangCode,
  { country: string; label: string }
> = {
  pt: { country: "pt", label: "Portuguese" },
  en: { country: "gb", label: "English" },
  fr: { country: "fr", label: "French" },
  nl: { country: "nl", label: "Dutch" },
  hu: { country: "hu", label: "Hungarian" },
  de: { country: "de", label: "German" },
  es: { country: "es", label: "Spanish" },
};

/** Languages offered in the public propose form. */
export const PROPOSE_LANGS: LangCode[] = ["pt", "en", "fr", "de"];

export function parseLanguages(value: string | null | undefined): LangCode[] {
  if (!value) return [];
  const allowed = new Set(Object.keys(LANG_META));
  return value
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter((s): s is LangCode => allowed.has(s));
}

export function serializeLanguages(langs: LangCode[]): string {
  return [...new Set(langs)].join(",");
}

/** Real flag image URL (Windows can't render emoji flags). */
export function flagImageUrl(country: string, width = 20) {
  return `https://flagcdn.com/w${width}/${country}.png`;
}
