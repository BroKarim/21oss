import { findAwesomeLists } from "@/server/web/awesome-list/queries";
import { AwesomeListing } from "./awesome-listing";

export const AwesomeQuery = async () => {
  const awesomeLists = await findAwesomeLists();

  return <AwesomeListing list={{ awesomeLists }} />;
};
