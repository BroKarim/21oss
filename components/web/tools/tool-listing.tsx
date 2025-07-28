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
  console.log("ToolListing: Received list:", list); // Debug log
  console.log("ToolListing: Received pagination:", pagination); // Debug log
  console.log("ToolListing: Received options:", options);
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
      <Input size="lg" placeholder="Loading..." disabled />
      <ToolListSkeleton />
    </div>
  );
};

export { ToolListing, ToolListingSkeleton, type ToolListingProps };
