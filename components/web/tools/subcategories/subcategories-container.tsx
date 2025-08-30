import ToolsBySubcategoryLazy from "@/components/web/tools/subcategories/subcategories-query";
import { FiltersProvider } from "@/contexts/filter-context";
import { ToolSearch } from "../tool-search";

interface SubcategoryContainerProps {
  subcategories: any[];
}

export default function SubcategoryContainer({ subcategories }: SubcategoryContainerProps) {
  return (
    <div className="space-y-6">
      <FiltersProvider enableFilters={true} enableSort={true}>
        <ToolSearch placeholder="Search in this subcategories..."  />
        <div className="space-y-8">
          {subcategories.map((sub) => (
            <section key={sub.slug} id={sub.slug} className="scroll-mt-24 space-y-4">
              <ToolsBySubcategoryLazy subcategorySlug={sub.slug} subcategoryLabel={sub.name} />
            </section>
          ))}
        </div>
      </FiltersProvider>
    </div>
  );
}
