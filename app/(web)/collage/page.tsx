import { findFreeStuffPerks } from "@/server/web/free-stuff/queries";
import { StuffClientWrapper } from "@/components/web/free-stuff/stuff-client-wrapper";
export default async function CollagePage() {
  const perks = await findFreeStuffPerks({});

  return (
    <div className="min-h-screen bg-background/50 py-10 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Pass data ke Client Wrapper */}
        <StuffClientWrapper initialData={perks} />
      </div>
    </div>
  );
}
