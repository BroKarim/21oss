// components/groups/tool-slider-group.tsx
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"; // Asumsikan menggunakan shadcn/ui
import { ToolMany } from "@/server/web/tools/payloads";
import { ToolCard } from "../tool-card";
import Link from "next/link";
import { Button } from "@/components/ui/button-shadcn";

type ToolSliderGroupProps = {
  id: string;
  label: string;
  tools: ToolMany[];
  options: {
    showScroll?: boolean;
    showViewAll?: boolean;
    viewAllUrl?: string;
  };
};

export const ToolSliderGroup = ({ id, label, tools, options }: ToolSliderGroupProps) => {
  const { showScroll = false, showViewAll = false, viewAllUrl } = options;

  // Jika showScroll false, batasi ke 4 item
  const displayedTools = showScroll ? tools : tools.slice(0, 4);

  if (!displayedTools.length) {
    return (
      <section className="space-y-4" id={id}>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{label}</h2>
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
    <section className="space-y-4">
      {/* Header dengan label dan tombol View All */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{label}</h2>
        {showViewAll && viewAllUrl && (
          <Button asChild variant="outline">
            <Link href={viewAllUrl}>View All</Link>
          </Button>
        )}
      </div>

      {/* Slider atau grid statis */}
      <div className="relative">
        {showScroll ? (
          <ScrollArea className="w-full -mx-1 px-1">
            <div className="flex space-x-4" style={{ minWidth: "100%", paddingLeft: "1px", paddingRight: "1px" }}>
              {displayedTools.map((tool, index) => (
                <div key={tool.id} className="min-w-[250px] max-w-[250px]">
                  <ToolCard tool={tool} style={{ order: index }} />
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" className="invisible" />
          </ScrollArea>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {displayedTools.map((tool, index) => (
              <ToolCard key={tool.id} tool={tool} style={{ order: index }} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
