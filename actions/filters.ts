"use server";

import { createServerAction } from "zsa";
import { findLicenses } from "@/server/web/licenses/queries";
import { findLanguageStacks } from "@/server/web/stacks/queries";
import { findPlatforms } from "@/server/web/platforms/queries";

export const findFilterOptions = createServerAction().handler(async () => {
  const filters = await Promise.all([findLanguageStacks({}), findLicenses({}), findPlatforms({})]);

  const [stack, license, platform] = filters.map((r) => r.map(({ slug, name, _count }) => ({ slug, name, count: _count.tools })));

  return { stack, license, platform } as const;
});
