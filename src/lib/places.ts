/**
 * Google Places API (New) — Text Search for listing snapshots.
 * Requires GOOGLE_PLACES_API_KEY in the environment.
 *
 * Docs: https://developers.google.com/maps/documentation/places/web-service/text-search
 */

export type PlaceSnapshot = {
  placeId: string;
  name: string;
  address: string;
  phone: string;
  url: string;
  hours: string;
  rating: number | null;
  reviewsCount: number;
  googleNote: string;
  mapsUri: string;
};

const PLACES_SEARCH =
  "https://places.googleapis.com/v1/places:searchText";

/** Bias searches toward Ericeira / Mafra coast. */
const ERICEIRA_BIAS = {
  circle: {
    center: { latitude: 38.9629, longitude: -9.4156 },
    radius: 35000.0,
  },
};

const FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.nationalPhoneNumber",
  "places.internationalPhoneNumber",
  "places.websiteUri",
  "places.googleMapsUri",
  "places.rating",
  "places.userRatingCount",
  "places.regularOpeningHours",
  "places.editorialSummary",
].join(",");

function getApiKey(): string {
  const key = process.env.GOOGLE_PLACES_API_KEY?.trim();
  if (!key) {
    throw new Error(
      "Missing GOOGLE_PLACES_API_KEY. Add it to .env.local then re-run."
    );
  }
  return key;
}

function formatHours(
  opening?: {
    weekdayDescriptions?: string[];
  } | null
): string {
  const days = opening?.weekdayDescriptions;
  if (!days?.length) return "";
  return days
    .map((d) =>
      d
        .replace(": Closed", ": closed")
        .replace(/\bMonday\b/g, "Mon")
        .replace(/\bTuesday\b/g, "Tue")
        .replace(/\bWednesday\b/g, "Wed")
        .replace(/\bThursday\b/g, "Thu")
        .replace(/\bFriday\b/g, "Fri")
        .replace(/\bSaturday\b/g, "Sat")
        .replace(/\bSunday\b/g, "Sun")
    )
    .join(" · ");
}

function normalizeName(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** Loose name overlap so "Talho Central" matches "Talho Central da Ericeira". */
export function namesLikelyMatch(queryName: string, placeName: string): boolean {
  const q = normalizeName(queryName);
  const p = normalizeName(placeName);
  if (!q || !p) return false;
  if (q === p) return true;
  if (p.includes(q) || q.includes(p)) return true;
  const qTokens = q.split(" ").filter((t) => t.length > 2);
  if (qTokens.length === 0) return false;
  const hits = qTokens.filter((t) => p.includes(t)).length;
  return hits / qTokens.length >= 0.6;
}

type PlacesSearchResponse = {
  places?: Array<{
    id?: string;
    displayName?: { text?: string };
    formattedAddress?: string;
    nationalPhoneNumber?: string;
    internationalPhoneNumber?: string;
    websiteUri?: string;
    googleMapsUri?: string;
    rating?: number;
    userRatingCount?: number;
    regularOpeningHours?: { weekdayDescriptions?: string[] };
    editorialSummary?: { text?: string };
  }>;
};

export async function searchPlaceSnapshot(
  query: string,
  opts?: { phoneHint?: string; requireNameMatch?: string }
): Promise<PlaceSnapshot | null> {
  const key = getApiKey();
  const textQuery = [query, "Ericeira Portugal"].filter(Boolean).join(" — ");

  const body: Record<string, unknown> = {
    textQuery,
    languageCode: "en",
    regionCode: "PT",
    maxResultCount: 5,
    locationBias: ERICEIRA_BIAS,
  };

  if (opts?.phoneHint) {
    // Prefer phone search when we have a clean number
    const digits = opts.phoneHint.replace(/[^\d+]/g, "");
    if (digits.length >= 9) {
      body.textQuery = digits;
    }
  }

  const res = await fetch(PLACES_SEARCH, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": key,
      "X-Goog-FieldMask": FIELD_MASK,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Places API ${res.status}: ${errText.slice(0, 300)}`);
  }

  const data = (await res.json()) as PlacesSearchResponse;
  const places = data.places || [];
  if (places.length === 0) return null;

  let best = places[0];
  if (opts?.requireNameMatch) {
    const matched = places.find((p) =>
      namesLikelyMatch(opts.requireNameMatch!, p.displayName?.text || "")
    );
    if (!matched) return null;
    best = matched;
  }

  const placeId = best.id || "";
  if (!placeId) return null;

  return {
    placeId,
    name: best.displayName?.text || "",
    address: best.formattedAddress || "",
    phone:
      best.internationalPhoneNumber || best.nationalPhoneNumber || "",
    url: best.websiteUri || "",
    hours: formatHours(best.regularOpeningHours),
    rating: typeof best.rating === "number" ? best.rating : null,
    reviewsCount: best.userRatingCount || 0,
    googleNote: best.editorialSummary?.text || "",
    mapsUri: best.googleMapsUri || "",
  };
}

export function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
