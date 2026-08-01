/**
 * Auto-unpublish contacts once private negative feedback exceeds this count.
 * The row stays in the DB with status `hidden` — not deleted.
 */
export const REPORT_AUTO_HIDE_AFTER = 3;
