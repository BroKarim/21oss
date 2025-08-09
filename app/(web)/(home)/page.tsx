import { cn } from "@/lib/utils";
import { BoltBanner } from "@/components/web/ui/banner";
import { homeSections } from "@/lib/constants/home-sections";
import LazySection from "@/components/web/lazy-section";

export default function Page() {
  return (
    <main className={cn("flex flex-1 flex-col overflow-x-hidden")}>
      <div className="container space-y-2 p-4 max-w-full">
        <BoltBanner />
        <div className="space-y-10 overflow-x-hidden">
          {homeSections.map((section) => (
            <LazySection key={section.id} section={section} />
          ))}
        </div>
      </div>
    </main>
  );
}
