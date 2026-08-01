/** Email helpers for contact mailto links. */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Strip mailto: and whitespace; return null if not a usable address. */
export function normalizeEmail(value: string | null | undefined): string | null {
  if (!value) return null;
  let email = value.trim();
  if (!email) return null;
  if (/^mailto:/i.test(email)) email = email.replace(/^mailto:/i, "").trim();
  // URLs / Instagram handles / paths mistakenly stored as email
  if (/^https?:\/\//i.test(email) || email.includes("/") || email.startsWith("@")) {
    return null;
  }
  if (!EMAIL_RE.test(email)) return null;
  return email;
}

export function toMailtoHref(value: string | null | undefined): string | null {
  const email = normalizeEmail(value);
  if (!email) return null;
  return `mailto:${email}`;
}
