import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { withAdminPage } from "@/components/admin/auth-hoc";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { findAwesomeLists } from "@/server/admin/awesome-list/queries";
import { awesomeListTableParamsCache } from "@/server/admin/awesome-list/schema";
import { AwesomeTable } from "./_components/awesome-table";
type AdsPageProps = {
  searchParams: Promise<SearchParams>;
};

const AdsPage = async ({ searchParams }: AdsPageProps) => {
  const search = awesomeListTableParamsCache.parse(await searchParams);
  const awesimePromise = findAwesomeLists(search);
  return (
    <Suspense fallback={<DataTableSkeleton title="Awesome list" />}>
      <AwesomeTable awesomePromise={awesimePromise} />
    </Suspense>
  );
};

export default withAdminPage(AdsPage);
