import { ToolMany } from "@/server/web/tools/payloads";
import Link from "next/link";
import { Button } from "@/components/ui/button-shadcn"; // dari shadcn/ui
import Image from "next/image"; // untuk favicon

type ToolFaviconGroupProps = {
  id: string;
  label: string;
  tools: ToolMany[];
  options: {
    showViewAll?: boolean;
    viewAllUrl?: string;
  };
};

export const ToolFaviconGroup = ({ id, label, tools, options }: ToolFaviconGroupProps) => {
  const { showViewAll = false, viewAllUrl } = options;

  if (!tools.length) {
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
        <div className="text-center text-muted-foreground">No tools available for this section.</div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border p-6 space-y-4" id={id}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl ">{label}</h2>
        {showViewAll && viewAllUrl && (
          <Button asChild variant="outline" size="sm" className="border-neutral-700">
            <Link href={viewAllUrl}>View All</Link>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-4 gap-4">
        {tools.map((tool) => (
          <Link key={tool.id} href={`/${tool.slug}`} className="flex items-center gap-3 p-2 rounded-lg transition hover:bg-accent">
            <Image src={tool.faviconUrl || "/placeholder.svg"} alt={`${tool.name} favicon`} width={48} height={48} className="rounded-sm border" />
            <div className="flex flex-col">
              <h3 className="text-sm font-medium leading-tight">{tool.name}</h3>
              {tool.platforms?.length ? <p className="text-xs text-muted-foreground">{tool.platforms.map((p) => p.name).join(", ")}</p> : null}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
