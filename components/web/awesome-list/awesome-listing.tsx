import { AwesomeList } from "./awesome-list";

export type AwesomeListingProps = {
  list: {
    awesomeLists: any[];
  };
};

export const AwesomeListing = ({ list }: AwesomeListingProps) => {
  return (
    <div className="space-y-5" id="awesome-lists">
      <AwesomeList awesomeLists={list.awesomeLists} />
    </div>
  );
};
