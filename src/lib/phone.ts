/**
 * Build a dialable `tel:` href from a displayed phone string.
 * Keeps a leading +, strips spaces / dashes / dots / parentheses.
 */
export function toTelHref(phone: string): string | null {
  const raw = phone.trim();
  if (!raw) return null;

  const hasPlus = raw.startsWith("+");
  const digits = raw.replace(/\D/g, "");
  if (digits.length < 6) return null;

  return `tel:${hasPlus ? "+" : ""}${digits}`;
}
