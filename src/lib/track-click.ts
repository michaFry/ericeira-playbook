import type { ClickKind } from "@/lib/types";

/** Fire-and-forget click tracking — must not delay tel:/maps navigation. */
export function trackClick(serviceId: string, kind: ClickKind) {
  try {
    const body = JSON.stringify({ kind });
    const url = `/api/services/${serviceId}/click`;
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      const sent = navigator.sendBeacon(url, blob);
      if (sent) return;
    }
    void fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    });
  } catch {
    // Ignore tracking failures
  }
}
