import { createSearchParamsCache, parseAsString } from "nuqs/server";

export const webPerksParamsSchema = {
  q: parseAsString.withDefault(""),
};

export const webPerksCache = createSearchParamsCache(webPerksParamsSchema);

export type WebPerksSearchParams = Awaited<ReturnType<typeof webPerksCache.parse>>;
