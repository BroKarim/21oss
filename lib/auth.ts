import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins";
import { headers } from "next/headers";
import { cache } from "react";
import { env } from "@/env";
import { db } from "@/services/db";

function buildTrustedOrigins() {
  const origins = new Set<string>();

  const addOriginVariants = (value: string) => {
    try {
      const url = new URL(value.trim());

      origins.add(url.origin);

      if (url.hostname === "localhost" || url.hostname.endsWith(".localhost")) {
        return;
      }

      if (url.hostname.startsWith("www.")) {
        origins.add(`${url.protocol}//${url.hostname.slice(4)}${url.port ? `:${url.port}` : ""}`);
        return;
      }

      origins.add(`${url.protocol}//www.${url.hostname}${url.port ? `:${url.port}` : ""}`);
    } catch {
      // Ignore malformed values so auth startup does not take down the whole app.
    }
  };

  addOriginVariants(env.BETTER_AUTH_URL);
  addOriginVariants(env.NEXT_PUBLIC_SITE_URL);

  return Array.from(origins);
}

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  trustedOrigins: buildTrustedOrigins(),

  emailVerification: {
    enabled: false,
    sendOnSignUp: false,
  },

  socialProviders: {
    google: {
      clientId: env.AUTH_GOOGLE_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET,
    },

    github: {
      clientId: env.AUTH_GITHUB_ID,
      clientSecret: env.AUTH_GITHUB_SECRET,
    },
  },
  session: {
    cookieCache: {
      enabled: true,
    },
  },

  plugins: [admin()],
});

export const getServerSession = cache(async () => {
  return auth.api.getSession({
    headers: await headers(),
  });
});
