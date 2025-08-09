import { ToolMany } from "@/server/web/tools/payloads";
import Link from "next/link";
import { Button } from "@/components/ui/button-shadcn"; // Asumsikan dari shadcn/ui
import Image from "next/image"; // Untuk favicon dengan optimasi

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

  // Batasi ke 10 item
  const displayedTools = tools.slice(0, 10);

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
    <section className="rounded-2xl p-6 space-y-4 border">
      {/* Header dengan judul dan tombol View All */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{label}</h2>
        {showViewAll && viewAllUrl && (
          <Button asChild variant="outline" className="border-neutral-700 text-sm">
            <Link href={viewAllUrl}>View All</Link>
          </Button>
        )}
      </div>

      {/* Grid 2 kolom, masing-masing 5 baris */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {displayedTools.map((tool) => (
          <Link key={tool.id} href={`/${tool.slug}`} className="flex items-center gap-3 p-2   rounded-lg transition">
            <Image src={tool.faviconUrl || "/placeholder.svg"} alt={`${tool.name} favicon`} width={48} height={48} className="rounded-sm border" />
            {/* Nama dan kategori pertama */}
            <div className="flex-1 flex-col">
              <h3 className="text-sm font-medium text-white leading-tight">{tool.name}</h3>
              {tool.categories?.[0] && <p className="text-sm text-gray-500">{tool.categories[0].name}</p>}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
