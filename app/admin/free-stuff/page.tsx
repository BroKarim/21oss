import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { withAdminPage } from "@/components/admin/auth-hoc";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";

import { findFreeStuff } from "@/server/admin/free-stuff/queries";
import { freeStuffTableParamsCache } from "@/server/admin/free-stuff/schema";

import { FreeStuffTable } from "./_components/free-stuff-table";

type FreeStuffPageProps = {
  searchParams: Promise<SearchParams>;
};

const FreeStuffPage = async ({ searchParams }: FreeStuffPageProps) => {
  const search = freeStuffTableParamsCache.parse(await searchParams);

  const freeStuffPromise = findFreeStuff(search);

  return (
    <Suspense fallback={<DataTableSkeleton title="Free Stuff" />}>
      <FreeStuffTable freeStuffPromise={freeStuffPromise} />
    </Suspense>
  );
};

export default withAdminPage(FreeStuffPage);
