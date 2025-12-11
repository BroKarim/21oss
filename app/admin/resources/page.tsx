import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { withAdminPage } from "@/components/admin/auth-hoc";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";

import { findResources } from "@/server/admin/resources/queries";
import { resourcesTableParamsCache } from "@/server/admin/resources/schema";

// Component ini belum kita buat, biarkan error dulu
import { ResourcesTable } from "./_components/resources-table";

type ResourcesPageProps = {
  searchParams: Promise<SearchParams>;
};

const ResourcesPage = async ({ searchParams }: ResourcesPageProps) => {
  const search = resourcesTableParamsCache.parse(await searchParams);

  const resourcesPromise = findResources(search);

  return (
    <Suspense fallback={<DataTableSkeleton title="Resources" />}>
      <ResourcesTable resourcesPromise={resourcesPromise} />
    </Suspense>
  );
};

export default withAdminPage(ResourcesPage);
