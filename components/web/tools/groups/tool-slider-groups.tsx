import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"; // Asumsikan menggunakan shadcn/ui
import { ToolMany } from "@/server/web/tools/payloads";
import { ToolCard } from "../tool-card";
import Link from "next/link";
import { Button } from "@/components/ui/button-shadcn";

type ToolSliderGroupProps = {
  id: string;
  label: string;
  description?: string;
  tools: ToolMany[];
  options: {
    showScroll?: boolean;
    showViewAll?: boolean;
    viewAllUrl?: string;
  };
};

export const ToolSliderGroup = ({ id, label, tools, options, description }: ToolSliderGroupProps) => {
  const { showScroll = false, showViewAll = false, viewAllUrl } = options;

  const displayedTools = showScroll ? tools : tools.slice(0, 4);

  if (!displayedTools.length) {
    return (
      <section className="space-y-4" id={id}>
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="md:text-2xl text-lg font-bold">{label}</h2>
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
          </div>

          {showViewAll && viewAllUrl && (
            <Button asChild variant="outline">
              <Link href={viewAllUrl}>View All</Link>
            </Button>
          )}
        </div>
        <div className="text-center text-gray-500">No tools available for this section.</div>
      </section>
    );
  }

  return (
    <section className="w-full  max-w-full space-y-4 border  p-2 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between">
        <h2 className="md:text-xl text-lg">{label}</h2>
      </div>

      <div className="w-full">
        {showScroll ? (
          <ScrollArea className="whitespace-nowrap rounded-md pb-4">
            <div className="flex w-max space-x-4">
              {displayedTools.map((tool) => (
                <div key={tool.id} className="w-[280px] shrink-0 sm:w-[320px]">
                  <ToolCard tool={tool} />
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {displayedTools.map((tool) => (
              <div key={tool.id} className="w-full">
                <ToolCard tool={tool} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
