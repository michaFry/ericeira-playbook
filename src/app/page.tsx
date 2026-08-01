import { PlaybookApp } from "@/components/PlaybookApp";
import { listApprovedServices, listCategories } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const categories = listCategories();
  const services = listApprovedServices();

  return <PlaybookApp categories={categories} services={services} />;
}
