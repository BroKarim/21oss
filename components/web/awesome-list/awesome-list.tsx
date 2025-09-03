import { AwesomeCard } from "./awesome-card";

export type AwesomeListProps = {
  awesomeLists: any[];
};

export const AwesomeList = ({ awesomeLists }: AwesomeListProps) => {
  if (!awesomeLists?.length) {
    return <div className="text-sm text-gray-400">No awesome lists found.</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 ">
      {awesomeLists.map((list) => (
        <AwesomeCard key={list.id} list={list} />
      ))}
    </div>
  );
};
