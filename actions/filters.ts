"use server";

import { createServerAction } from "zsa";
import { findLicenses } from "@/server/web/licenses/queries";
import { findStacks } from "@/server/web/stacks/queries";

export const findFilterOptions = createServerAction().handler(async () => {
  const filters = await Promise.all([ findStacks({}), findLicenses({})]);

  // Map the filters to the expected format
  const [stack, license] = filters.map((r) => r.map(({ slug, name, _count }) => ({ slug, name, count: _count.tools })));

  return { stack, license } as const;
});
