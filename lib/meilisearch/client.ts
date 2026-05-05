import { Meilisearch } from "meilisearch";
import { env } from "@/env";

const globalForMeili = globalThis as typeof globalThis & {
  meiliClient?: Meilisearch;
};

export const meiliClient =
  globalForMeili.meiliClient ??
  new Meilisearch({
    host: env.MEILI_HOST,
    apiKey: env.MEILI_MASTER_KEY,
  });

if (process.env.NODE_ENV !== "production") {
  globalForMeili.meiliClient = meiliClient;
}
