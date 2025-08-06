// components/web/tools/tools-by-subcategory.tsx

import { findTools } from "@/server/web/tools/queries";
import { ToolListing } from "@/components/web/tools/tool-listing";

type ToolsBySubcategoryProps = {
  subcategories: {
    slug: string;
    name: string;
    description?: string | null;
  }[];
};

export const ToolsBySubcategory = async ({ subcategories }: ToolsBySubcategoryProps) => {
  const toolsPerSubcategory = await Promise.all(
    subcategories.map(async (sub) => {
      const tools = await findTools({
        where: { categories: { some: { slug: sub.slug } } },
      });

      return {
        ...sub,
        tools,
      };
    })
  );

  return (
    <div className="space-y-8">
      {toolsPerSubcategory.map((sub) => (
        <section key={sub.slug} id={sub.slug} className="scroll-mt-24 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">{sub.name}</h2>
            {sub.description && <p className="text-muted-foreground text-sm max-w-[75%]">{sub.description}</p>}
          </div>

          {sub.tools.length > 0 ? (
            <ToolListing
              list={{ tools: sub.tools }}
              pagination={{
                totalCount: sub.tools.length,
                pageSize: sub.tools.length,
              }}
            />
          ) : (
            <p className="text-muted-foreground text-sm">No tools found in this category.</p>
          )}
        </section>
      ))}
    </div>
  );
};
