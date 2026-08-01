"use client";

import {
  LANG_META,
  PROPOSE_LANGS,
  flagImageUrl,
  parseLanguages,
  type LangCode,
} from "@/lib/languages";

function FlagIcon({
  country,
  label,
  size = 14,
}: {
  country: string;
  label: string;
  size?: number;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={flagImageUrl(country, size <= 14 ? 20 : 40)}
      alt=""
      title={label}
      width={Math.round(size * 1.33)}
      height={size}
      className="inline-block shrink-0 rounded-[2px] object-cover shadow-sm ring-1 ring-black/10"
      loading="lazy"
      decoding="async"
    />
  );
}

/** Typed language chips with real flag images (works on Windows). */
export function LanguageFlags({
  languages,
  className = "",
}: {
  languages: string | LangCode[];
  className?: string;
}) {
  const codes = Array.isArray(languages)
    ? languages
    : parseLanguages(languages);
  if (codes.length === 0) return null;

  return (
    <span
      className={`inline-flex flex-wrap items-center gap-1 ${className}`}
      aria-label={`Languages: ${codes.map((c) => LANG_META[c].label).join(", ")}`}
    >
      {codes.map((code) => {
        const meta = LANG_META[code];
        return (
          <span
            key={code}
            title={meta.label}
            className="inline-flex items-center gap-1 rounded-md bg-foam px-1.5 py-0.5 text-[0.7rem] font-semibold uppercase tracking-wide text-ink ring-1 ring-ocean/12"
          >
            <FlagIcon country={meta.country} label={meta.label} size={12} />
            <span>{code}</span>
          </span>
        );
      })}
    </span>
  );
}

/** Checkbox grid for picking spoken languages (flag + label). */
export function LanguagePicker({
  value,
  onChange,
  options = PROPOSE_LANGS,
}: {
  value: LangCode[];
  onChange: (next: LangCode[]) => void;
  options?: LangCode[];
}) {
  function toggle(code: LangCode) {
    onChange(
      value.includes(code)
        ? value.filter((c) => c !== code)
        : [...value, code]
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {options.map((code) => {
        const checked = value.includes(code);
        const meta = LANG_META[code];
        return (
          <label
            key={code}
            className={`pressable flex min-h-11 cursor-pointer items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold ring-1 transition ${
              checked
                ? "bg-ocean/10 text-ocean ring-ocean/30"
                : "bg-white text-ink ring-ocean/15 hover:ring-ocean/30"
            }`}
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={() => toggle(code)}
              className="h-4 w-4 accent-ocean"
            />
            <FlagIcon country={meta.country} label={meta.label} size={14} />
            <span className="truncate">{meta.label}</span>
          </label>
        );
      })}
    </div>
  );
}
