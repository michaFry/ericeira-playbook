import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const COOKIE = "playbook_admin";

function token() {
  const password = process.env.ADMIN_PASSWORD || "ericeira-dads";
  return createHmac("sha256", "ericeira-playbook-salt")
    .update(password)
    .digest("hex");
}

export async function isAdmin() {
  const jar = await cookies();
  const value = jar.get(COOKIE)?.value;
  if (!value) return false;
  const expected = token();
  try {
    return timingSafeEqual(Buffer.from(value), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function adminCookieValue() {
  return token();
}

export function adminCookieName() {
  return COOKIE;
}

export function checkPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD || "ericeira-dads";
  if (password.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(password), Buffer.from(expected));
  } catch {
    return false;
  }
}
