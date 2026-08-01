import { PlaybookApp } from "@/components/PlaybookApp";
import {
  listApprovedServices,
  listCategories,
  listPublicVoteNotesByService,
} from "@/lib/db";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const categories = listCategories();
  const services = listApprovedServices();
  const voteNotes = listPublicVoteNotesByService();

  return (
    <PlaybookApp
      categories={categories}
      services={services}
      voteNotes={voteNotes}
    />
  );
}
