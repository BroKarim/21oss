import { Meilisearch } from "meilisearch";
import { env } from "@/env";

const globalForMeili = globalThis as typeof globalThis & {
  meiliClient?: Meilisearch;
};

export function hasMeiliConfig() {
  return Boolean(env.MEILI_HOST && env.MEILI_MASTER_KEY);
}

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

export function getMeiliClient() {
  if (globalForMeili.meiliClient) {
    return globalForMeili.meiliClient;
  }

  const client = new Meilisearch(getMeiliConfig());

  if (process.env.NODE_ENV !== "production") {
    globalForMeili.meiliClient = client;
  }

  return client;
}
