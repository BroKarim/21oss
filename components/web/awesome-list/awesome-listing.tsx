import { AwesomeList } from "./awesome-list";
import { Pagination, type PaginationProps } from "@/components/web/pagination";
import { FiltersProvider } from "@/contexts/filter-context";
import { AwesomeSearch } from "./awesome-search";
export type AwesomeListingProps = {
  list: {
    awesomeLists: any[];
  };
  pagination: PaginationProps;
};

export const AwesomeListing = ({ list, pagination }: AwesomeListingProps) => {
  return (
    <div className="space-y-5" id="awesome-lists">
      <FiltersProvider enableFilters={true} enableSort={true}>
        <AwesomeSearch placeholder="Search in this subcategories..." />
        <AwesomeList awesomeLists={list.awesomeLists} />
        <Pagination {...pagination} />
      </FiltersProvider>
    </div>
  );
};
