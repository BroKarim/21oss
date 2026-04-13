import "dotenv/config";

import { ToolStatus, ToolType } from "@prisma/client";
import { db } from "@/services/db";
import { tryCatch } from "@/utils/helpers";

let cachedGithubToken: string | null = null;
function requireGithubToken(): string {
  if (cachedGithubToken) return cachedGithubToken;
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error("❌ GITHUB_TOKEN tidak ditemukan di .env");
  }
  cachedGithubToken = token;
  return token;
}

// ---------------------------------------------------------------------------
// Konfigurasi
// ---------------------------------------------------------------------------

const MIN_STARS = 100;

const MAX_YEARS_SINCE_UPDATE = 2;

const PER_PAGE = 50;

const MAX_PAGES_PER_QUERY = Number(process.env.FETCH_MAX_PAGES ?? 1);
const REQUEST_DELAY_MS = Number(process.env.GH_REQUEST_DELAY_MS ?? 1500);
const MAX_RETRIES = Number(process.env.GH_MAX_RETRIES ?? 3);

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

const pushedAfter = new Date();
pushedAfter.setFullYear(pushedAfter.getFullYear() - 1);
const PUSHED_AFTER = pushedAfter.toISOString().slice(0, 10); // YYYY-MM-DD
// GitHub search supports `stars:>N`, so use `>99` for ">=100".
const STARS_QUERY = `stars:>${Math.max(0, MIN_STARS - 1)}`;

const SEARCH_QUERIES = [
  // Next.js / React (TS-first)
  `topic:nextjs ${STARS_QUERY} pushed:>${PUSHED_AFTER} language:TypeScript`,
  `topic:nextjs-template ${STARS_QUERY} pushed:>${PUSHED_AFTER} language:TypeScript`,
  `nextjs (starter OR template OR boilerplate) ${STARS_QUERY} pushed:>${PUSHED_AFTER} language:TypeScript in:name,description,readme`,
  `react (starter OR template OR boilerplate) ${STARS_QUERY} pushed:>${PUSHED_AFTER} language:TypeScript in:name,description,readme`,

  // Vite / Remix / Astro / SvelteKit / Solid / Qwik
  `vite (starter OR template OR boilerplate) ${STARS_QUERY} pushed:>${PUSHED_AFTER} language:TypeScript in:name,description,readme`,
  `remix (starter OR template OR boilerplate) ${STARS_QUERY} pushed:>${PUSHED_AFTER} language:TypeScript in:name,description,readme`,
  `topic:astro ${STARS_QUERY} pushed:>${PUSHED_AFTER} language:TypeScript`,
  `astro (starter OR template OR boilerplate) ${STARS_QUERY} pushed:>${PUSHED_AFTER} language:TypeScript in:name,description,readme`,
  `topic:svelte ${STARS_QUERY} pushed:>${PUSHED_AFTER} language:TypeScript`,
  `sveltekit (starter OR template OR boilerplate) ${STARS_QUERY} pushed:>${PUSHED_AFTER} language:TypeScript in:name,description,readme`,
  `solidjs (starter OR template OR boilerplate) ${STARS_QUERY} pushed:>${PUSHED_AFTER} language:TypeScript in:name,description,readme`,
  `qwik (starter OR template OR boilerplate) ${STARS_QUERY} pushed:>${PUSHED_AFTER} language:TypeScript in:name,description,readme`,

  // Vue / Nuxt
  `topic:vue ${STARS_QUERY} pushed:>${PUSHED_AFTER} language:TypeScript`,
  `vue (starter OR template OR boilerplate) ${STARS_QUERY} pushed:>${PUSHED_AFTER} language:TypeScript in:name,description,readme`,
  `nuxt (starter OR template OR boilerplate) ${STARS_QUERY} pushed:>${PUSHED_AFTER} language:TypeScript in:name,description,readme`,

  // Node backends (TS)
  `hono (starter OR template OR boilerplate) ${STARS_QUERY} pushed:>${PUSHED_AFTER} language:TypeScript in:name,description,readme`,
  `nitro (starter OR template OR boilerplate) ${STARS_QUERY} pushed:>${PUSHED_AFTER} language:TypeScript in:name,description,readme`,
  `fastify (starter OR template OR boilerplate) ${STARS_QUERY} pushed:>${PUSHED_AFTER} language:TypeScript in:name,description,readme`,
  `nestjs (starter OR template OR boilerplate) ${STARS_QUERY} pushed:>${PUSHED_AFTER} language:TypeScript in:name,description,readme`,
  `express (starter OR template OR boilerplate) ${STARS_QUERY} pushed:>${PUSHED_AFTER} language:TypeScript in:name,description,readme`,

  // JS fallback (some good repos still JS-only)
  `nextjs (starter OR template) ${STARS_QUERY} pushed:>${PUSHED_AFTER} language:JavaScript in:name,description,readme`,
  `vite (starter OR template) ${STARS_QUERY} pushed:>${PUSHED_AFTER} language:JavaScript in:name,description,readme`,
];

// ---------------------------------------------------------------------------
// Types (GitHub Search REST API response)
// ---------------------------------------------------------------------------

type GitHubSearchItem = {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  pushed_at: string; // ISO date string
  created_at: string;
  fork: boolean;
  archived: boolean;
  owner: {
    login: string;
    avatar_url: string;
  };

  license: {
    key: string;
    name: string;
    spdx_id: string; // e.g. "MIT", "Apache-2.0", "NOASSERTION"
  } | null;
};

type GitHubSearchResponse = {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubSearchItem[];
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Hitung tanggal N tahun yang lalu dalam format YYYY-MM-DD */
function yearsAgo(n: number): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() - n);
  return d.toISOString().split("T")[0];
}

function toSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function buildUniqueSlug(base: string): Promise<string> {
  let candidate = toSlug(base);
  let i = 1;
  while (await db.tool.findUnique({ where: { slug: candidate } })) {
    candidate = `${toSlug(base)}-${i}`;
    i++;
  }
  return candidate;
}

/** Ambil 1 halaman hasil search dari GitHub REST API */
async function fetchPage(query: string, page: number): Promise<GitHubSearchItem[]> {
  const since = yearsAgo(MAX_YEARS_SINCE_UPDATE);

  const params = new URLSearchParams({
    q: `${query} pushed:>${since} stars:>=${MIN_STARS} fork:false archived:false`,
    sort: "stars",
    order: "desc",
    per_page: String(PER_PAGE),
    page: String(page),
  });

  const url = `https://api.github.com/search/repositories?${params}`;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const { data, error } = await tryCatch(
      fetch(url, {
        headers: {
          Authorization: `Bearer ${requireGithubToken()}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }).then(async (res) => {
        if (!res.ok) {
          const status = res.status;
          const retryAfter = res.headers.get("retry-after");
          const remaining = res.headers.get("x-ratelimit-remaining");
          const reset = res.headers.get("x-ratelimit-reset");

          let waitMs = 0;
          if (retryAfter) {
            waitMs = Number(retryAfter) * 1000;
          } else if (remaining === "0" && reset) {
            const resetMs = Number(reset) * 1000;
            waitMs = Math.max(resetMs - Date.now(), 0) + 2000;
          } else if (status === 403) {
            waitMs = 2000 * attempt;
          }

          if (waitMs > 0 && attempt < MAX_RETRIES) {
            console.warn(`⚠️ GitHub API ${status} for query "${query}" page ${page}. Retrying in ${Math.ceil(waitMs / 1000)}s...`);
            await new Promise((r) => setTimeout(r, waitMs));
            throw new Error("retry");
          }

          throw new Error(`GitHub API error [${status}]`);
        }
        return res.json() as Promise<GitHubSearchResponse>;
      }),
    );

    if (!error) return data.items;
  }

  console.error(`Failed to fetch page ${page} for query "${query}" after ${MAX_RETRIES} attempts.`);
  return [];
}

// ---------------------------------------------------------------------------
// Filter Logic
// ---------------------------------------------------------------------------

function isValidRepo(item: GitHubSearchItem): boolean {
  // Sudah difilter via API query, tapi double-check di sini
  if (item.fork || item.archived) return false;
  if (!item.description || item.description.trim().length === 0) return false;
  if (item.stargazers_count < MIN_STARS) return false;

  // Verifikasi last push (bisa berbeda dari query filter karena GitHub cache)
  const lastPush = new Date(item.pushed_at);
  const cutoff = new Date();
  cutoff.setFullYear(cutoff.getFullYear() - MAX_YEARS_SINCE_UPDATE);
  if (lastPush < cutoff) return false;

  return true;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

export async function fetchAndSaveTemplates(): Promise<{
  total: number;
  inserted: number;
  skipped: number;
}> {
  // Fail fast if token missing (runtime/cron/CLI), but avoid crashing at import time.
  requireGithubToken();

  let inserted = 0;
  let skipped = 0;
  let total = 0;

  // Jalankan semua query, lalu de-dupe berdasarkan html_url sebelum save ke DB
  const seen = new Set<string>();
  const candidates: GitHubSearchItem[] = [];

  for (const query of SEARCH_QUERIES) {
    for (let page = 1; page <= MAX_PAGES_PER_QUERY; page++) {
      console.log(`⏳ Fetching: "${query}" – page ${page}`);

      const items = await fetchPage(query, page);

      if (items.length === 0) break; // tidak ada hasil, lanjut ke query berikutnya

      for (const item of items) {
        if (seen.has(item.html_url)) continue;
        seen.add(item.html_url);
        if (isValidRepo(item)) {
          candidates.push(item);
        }
      }

      // Hormati GitHub rate limit: 30 req/menit untuk Search API
      await new Promise((r) => setTimeout(r, REQUEST_DELAY_MS));
    }
  }

  total = candidates.length;
  console.log(`\n✅ Total kandidat unik setelah filter: ${total}`);

  // Simpan ke database – sequential agar slug generation tidak race condition
  for (const item of candidates) {
    // Cek duplikat berdasarkan repositoryUrl (constraint @unique di schema)
    const { data: existing, error: findError } = await tryCatch(
      db.tool.findUnique({
        where: { repositoryUrl: item.html_url },
        select: { id: true },
      }),
    );

    if (findError) {
      console.error(`Failed to check duplicate for ${item.full_name}:`, { error: findError });
      continue;
    }

    if (existing) {
      // Update stats-nya saja (stars & forks berubah tiap hari)
      const { error: updateError } = await tryCatch(
        db.tool.update({
          where: { id: existing.id },
          data: {
            stars: item.stargazers_count,
            forks: item.forks_count,
            lastCommitDate: new Date(item.pushed_at),
          },
        }),
      );

      if (updateError) {
        console.error(`Failed to update stats for ${item.full_name}:`, { error: updateError });
      } else {
        skipped++;
        console.log(`  ⏩ Skip (already exists, stats updated): ${item.full_name}`);
      }
      continue;
    }

    // Buat slug unik dari nama repo
    const slug = await buildUniqueSlug(item.name);

    // Siapkan relasi lisensi jika tersedia dari GitHub
    const licenseSlug = item.license?.spdx_id;
    const licenseName = item.license?.name;
    const hasValidLicense = licenseSlug && licenseSlug !== "NOASSERTION" && licenseName;

    const { error: createError } = await tryCatch(
      db.tool.create({
        data: {
          name: item.name,
          slug,
          repositoryUrl: item.html_url,
          websiteUrl: item.homepage || null,
          description: item.description,
          tagline: item.description?.substring(0, 120) ?? null,
          stars: item.stargazers_count,
          forks: item.forks_count,
          faviconUrl: item.owner.avatar_url,
          firstCommitDate: new Date(item.created_at),
          lastCommitDate: new Date(item.pushed_at),
          type: ToolType.Template,
          status: ToolStatus.Draft,
          isTweeted: false,
          // Hubungkan atau buat lisensi baru jika ada
          ...(hasValidLicense && {
            license: {
              connectOrCreate: {
                where: { slug: licenseSlug.toLowerCase() },
                create: {
                  name: licenseName,
                  slug: licenseSlug.toLowerCase(),
                },
              },
            },
          }),
        },
      }),
    );

    if (createError) {
      console.error(`Failed to insert ${item.full_name}:`, { error: createError });
    } else {
      inserted++;
      console.log(`  ✅ Inserted: ${item.full_name} (⭐ ${item.stargazers_count})`);
    }
  }

  return { total, inserted, skipped };
}

// ---------------------------------------------------------------------------
// CLI Entry Point (jalankan langsung via `npx tsx`)
// ---------------------------------------------------------------------------

const isRunDirectly = process.argv[1]?.endsWith("fetch-templates.ts");

if (isRunDirectly) {
  const maxPages = MAX_PAGES_PER_QUERY;
  const estimatedMax = SEARCH_QUERIES.length * maxPages * PER_PAGE;
  console.log("🚀 Starting GitHub template fetcher...");
  console.log(`⚙️  Config: ${SEARCH_QUERIES.length} queries × ${maxPages} page(s) × ${PER_PAGE}/page`);
  console.log(`📊 Estimated max candidates (before dedup): ~${estimatedMax}`);
  console.log(`💡 Tip: set FETCH_MAX_PAGES=3 untuk bulk initial import\n`);

  fetchAndSaveTemplates()
    .then(({ total, inserted, skipped }) => {
      console.log("\n--- Summary ---");
      console.log(`Total kandidat : ${total}`);
      console.log(`Inserted       : ${inserted} baru`);
      console.log(`Skipped/Updated: ${skipped} (sudah ada, stats diperbarui)`);
      console.log("Done! ✅");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Fatal error:", err);
      process.exit(1);
    });
}
