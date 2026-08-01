export type ServiceKind = "contact" | "procedure";

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  sort_order: number;
};

export type Service = {
  id: string;
  category_id: string;
  name: string;
  details: string;
  address: string;
  phone: string;
  email: string;
  url: string;
  hours: string;
  rating: number | null;
  reviews_count: number;
  google_note: string;
  languages: string;
  kind: ServiceKind;
  /** JSON array of step strings when kind === "procedure". */
  steps: string;
  /** Trade specialty (electrician, plumber, …) — mainly for Trades. */
  specialty: string;
  lat: number | null;
  lng: number | null;
  place_id: string;
  google_enriched_at: string;
  votes: number;
  status: "approved" | "pending" | "rejected" | "hidden";
  created_at: string;
  proposed_by: string;
};

export type ServiceWithCategory = Service & {
  category_name: string;
  category_slug: string;
  category_icon: string;
};

/** Private negative feedback — admin only, never shown publicly. */
export type Report = {
  id: string;
  service_id: string;
  reporter_key: string;
  reason: string;
  created_at: string;
};

export type ServiceReportSummary = {
  service_id: string;
  service_name: string;
  category_name: string;
  status: Service["status"];
  report_count: number;
  reports: Report[];
};

export type ClickKind = "phone" | "address" | "email" | "url";

/** Admin-only click analytics. */
export type ServiceClickStats = {
  service_id: string;
  service_name: string;
  category_name: string;
  status: Service["status"];
  total_clicks: number;
  phone_clicks: number;
  address_clicks: number;
  email_clicks: number;
  url_clicks: number;
};

/** Public tip note left after a thumbs-up (no voter identity). */
export type VoteNotePublic = {
  id: string;
  service_id: string;
  body: string;
  created_at: string;
};

/** Admin view of tip notes. */
export type VoteNoteAdmin = VoteNotePublic & {
  service_name: string;
  category_name: string;
};
