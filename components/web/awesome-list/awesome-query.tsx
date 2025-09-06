import type { Prisma } from "@prisma/client";
import type { SearchParams } from "nuqs/server";
import type { PaginationProps } from "@/components/web/pagination";
import { AwesomeListing, type AwesomeListingProps } from "./awesome-listing";
import { awesomeFilterSchema } from "@/server/web/awesome-list/schema";
import { searchAwesomeLists } from "@/server/web/awesome-list/queries";

type AwesomeQueryProps = Omit<AwesomeListingProps, "list" | "pagination"> & {
  searchParams: Promise<SearchParams>;
  overrideParams?: Partial<Parameters<typeof awesomeFilterSchema.parse>[0]>;
  where?: Prisma.AwesomeListWhereInput;
  pagination?: Partial<Omit<PaginationProps, "totalCount" | "pageSize">>;
};
export const AwesomeQuery = async ({ searchParams, overrideParams, where, pagination, ...props }: AwesomeQueryProps) => {
  const parsedParams = awesomeFilterSchema.parse((await searchParams) ?? {});

  const params = { ...parsedParams, ...overrideParams };
  const { awesomeLists, totalCount } = await searchAwesomeLists(params, where);

  return <AwesomeListing list={{ awesomeLists }} pagination={{ totalCount, pageSize: params.perPage, ...pagination }} {...props} />;
};
