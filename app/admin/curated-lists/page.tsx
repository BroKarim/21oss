import { Suspense } from "react";
import { withAdminPage } from "@/components/admin/auth-hoc";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { findCuratedLists } from "@/server/admin/curated-list/queries";
import { CuratedListsTable } from "@/app/admin/curated-lists/_components/curated-lists-table";
import { curatedListsTableParamsCache } from "@/server/admin/curated-list/schema";

import type { SearchParams } from "nuqs/server";
type CuratedListsPageProps = { searchParams: Promise<SearchParams> };

const CuratedListsPage = async ({ searchParams }: CuratedListsPageProps) => {
  const search = curatedListsTableParamsCache.parse(await searchParams);
  const curatedListsPromise = findCuratedLists(search);
  return (
    <Suspense fallback={<DataTableSkeleton title="Curated Lists" />}>
      <CuratedListsTable curatedListsPromise={curatedListsPromise} />
    </Suspense>
  );
};

export default withAdminPage(CuratedListsPage);
