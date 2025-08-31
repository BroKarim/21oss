import { Input } from "@/components/ui/input";
import { Pagination, type PaginationProps } from "@/components/web/pagination";
import { ToolList, type ToolListProps } from "@/components/web/tools/tool-list";
import { ToolListSkeleton } from "@/components/web/tools/tool-list";
import { FiltersProvider, type FiltersProviderProps } from "@/contexts/filter-context";

type ToolListingProps = {
  list: ToolListProps;
  pagination: PaginationProps;
  options?: FiltersProviderProps;
};

const ToolListing = ({ list, pagination, options }: ToolListingProps) => {
  return (
    <FiltersProvider {...options}>
      <div className="space-y-5" id="tools">
        <ToolList {...list} />
      </div>

      <Pagination {...pagination} />
    </FiltersProvider>
  );
};

const ToolListingSkeleton = () => {
  return (
    <div className="space-y-5">
      <Input placeholder="Loading..." disabled />
      <ToolListSkeleton />
    </div>
  );
};

export { ToolListing, ToolListingSkeleton, type ToolListingProps };
