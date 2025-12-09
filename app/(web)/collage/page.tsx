import { PerksTable } from "@/components/web/collage-table";
import { findFreeStuffPerks } from "@/server/web/free-stuff/queries";

export default async function CollagePage() {
  const perks = await findFreeStuffPerks({
    where: {},
  });

  return (
    <div className="min-h-screen bg-background/50 py-10 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Student Perks</h1>
            <p className="text-muted-foreground mt-1">Curated list of free tools and discounts for developers & students.</p>
          </div>
        </div>

        <PerksTable data={perks} />
      </div>
    </div>
  );
}
