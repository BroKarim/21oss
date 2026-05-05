import { Meilisearch } from "meilisearch";
import { env } from "@/env";

const globalForMeili = globalThis as typeof globalThis & {
  meiliClient?: Meilisearch;
};

function getMeiliConfig() {
  if (!env.MEILI_HOST) {
    throw new Error("Missing required env: MEILI_HOST");
  }

  if (!env.MEILI_MASTER_KEY) {
    throw new Error("Missing required env: MEILI_MASTER_KEY");
  }

  return {
    host: env.MEILI_HOST,
    apiKey: env.MEILI_MASTER_KEY,
  };
}

export const meiliClient =
  globalForMeili.meiliClient ??
  new Meilisearch(getMeiliConfig());

if (process.env.NODE_ENV !== "production") {
  globalForMeili.meiliClient = meiliClient;
}
