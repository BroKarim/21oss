import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { withAdminPage } from "@/components/admin/auth-hoc";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { findAds } from "@/server/admin/ads/queries";
import { adsTableParamsCache } from "@/server/admin/ads/schema";
import { AdsTable } from "./_components/ads-table";
type AdsPageProps = {
  searchParams: Promise<SearchParams>;
};

const AdsPage = async ({ searchParams }: AdsPageProps) => {
  const search = adsTableParamsCache.parse(await searchParams);
  const adsPromise = findAds(search);
  return <Suspense fallback={<DataTableSkeleton title="Ads" />}>
    <AdsTable adsPromise={adsPromise} />
  </Suspense>;
};

export default withAdminPage(AdsPage);
