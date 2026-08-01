/** Optional public tip notes left after a positive vote. */

export const VOTE_NOTE_MAX = 120;
export const VOTE_NOTE_MIN = 3;

export function sanitizeVoteNote(raw: unknown): string | null {
  const text = String(raw || "")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length < VOTE_NOTE_MIN) return null;
  if (text.length > VOTE_NOTE_MAX) return text.slice(0, VOTE_NOTE_MAX);
  return text;
}
