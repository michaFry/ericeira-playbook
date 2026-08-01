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
  phone: string;
  email: string;
  url: string;
  votes: number;
  status: "approved" | "pending" | "rejected";
  created_at: string;
  proposed_by: string;
};

export type ServiceWithCategory = Service & {
  category_name: string;
  category_slug: string;
  category_icon: string;
};
