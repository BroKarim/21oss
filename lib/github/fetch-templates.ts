/**
 * fetch-templates.ts
 *
 * Script untuk mencari template/boilerplate/starter populer dari GitHub Search REST API
 * dan menyimpannya ke database sebagai Tool dengan status Draft.
 *
 * Run manual (local):
 *   npx tsx lib/github/fetch-templates.ts
 *
 * Bulk initial import:
 *   FETCH_MAX_PAGES=3 npx tsx lib/github/fetch-templates.ts
 *
 * Atau lewat API route (cron):
 *   POST /api/cron/fetch-templates
 */
import "dotenv/config"; // ← Harus import PERTAMA agar DATABASE_URL terbaca sebelum Prisma init

import { ToolStatus, ToolType } from "@prisma/client";
import { db } from "@/services/db";
import { tryCatch } from "@/utils/helpers";

// Ambil token langsung dari process.env agar script bisa dijalankan
// via `npx tsx --env-file=.env` tanpa perlu Next.js runtime context
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
if (!GITHUB_TOKEN) {
  console.error("❌ GITHUB_TOKEN tidak ditemukan di .env");
  process.exit(1);
}


// ---------------------------------------------------------------------------
// Konfigurasi
// ---------------------------------------------------------------------------

/**
 * Jumlah minimal bintang repo agar masuk. 100 dipilih sebagai sweet-spot:
 * - Terlalu rendah (< 50) → terlalu banyak repo murahan / tidak terawat
 * - Terlalu tinggi (> 500) → terlalu sedikit hasil, melewatkan banyak template bagus
 */
const MIN_STARS = 100;

/**
 * Repo wajib diperbarui dalam 2 tahun terakhir.
 * Memastikan stack yang dipakai tidak terlalu jadul.
 */
const MAX_YEARS_SINCE_UPDATE = 2;

/** Berapa repo per-query yang diambil dari API GitHub (max 100) */
const PER_PAGE = 50;

/**
 * Berapa halaman per-query yang di-fetch dalam sekali jalan.
 * - Untuk testing / first run: 1 (default) → max ~1.150 kandidat total
 * - Untuk initial bulk import: atur env var FETCH_MAX_PAGES=3
 * - Untuk daily cron: 1-2 sudah lebih dari cukup (sebagian besar akan di-skip/update)
 */
const MAX_PAGES_PER_QUERY = Number(process.env.FETCH_MAX_PAGES ?? 1);
const REQUEST_DELAY_MS = Number(process.env.GH_REQUEST_DELAY_MS ?? 1500);
const MAX_RETRIES = Number(process.env.GH_MAX_RETRIES ?? 3);

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

/**
 * Berbagai kombinasi query untuk memaksimalkan coverage.
 * GitHub Search membatasi rate, jadi jangan terlalu banyak.
 * Urutan penting: yang paling spesifik duluan.
 */
const SEARCH_QUERIES = [
  // Template & Starter
  "topic:nextjs-template",
  "topic:react-template",
  "topic:typescript-template",
  "topic:vite-template",
  "topic:nuxt-template",
  "topic:vue-template",
  "topic:angular-template",
  "topic:svelte-template",
  "topic:preact-template",
  "topic:remix-template",
  "topic:solidjs-template",
  "topic:astro-template",
  "topic:qwik-template",
  "topic:express-template",
  "topic:fastapi-template",
  "topic:django-template",
  "topic:laravel-template",
  "topic:tailwindcss-template",
  "topic:shadcn-template",
  "topic:react-native-template",
  "topic:rn-template",
  "topic:mobile-template",
  "topic:css-template",
  "topic:ui-template",
  "topic:database-template",
  "topic:auth-template",
  "topic:firebase-template",
  "topic:supabase-template",
  "topic:postgres-template",
  "topic:mysql-template",
  "topic:sqlite-template",
  "topic:mongodb-template",
  "topic:prisma-template",
  "topic:drizzle-template",
  "topic:orm-template",
  // Keyword fallback (jika repo tidak ada topic tapi namanya jelas)
  "template in:name,description stars:>50",
  "boilerplate in:name,description stars:>50",
  "starter in:name,description stars:>50",
  "starter-kit in:name,description stars:>50",
  "scaffold in:name,description stars:>50",
  // Framework JS/TS
  "react template in:name,description stars:>50",
  "next.js template in:name,description stars:>50",
  "vue template in:name,description stars:>50",
  "nuxt template in:name,description stars:>50",
  "angular template in:name,description stars:>50",
  "svelte template in:name,description stars:>50",
  "preact template in:name,description stars:>50",
  "remix template in:name,description stars:>50",
  "solidjs template in:name,description stars:>50",
  "astro template in:name,description stars:>50",
  "qwik template in:name,description stars:>50",
  "react native template in:name,description stars:>50",
  // CSS / UI
  "tailwind template in:name,description stars:>50",
  "radix ui template in:name,description stars:>50",
  "chakra ui template in:name,description stars:>50",
  "css modules template in:name,description stars:>50",
  "css-in-js template in:name,description stars:>50",
  "material ui template in:name,description stars:>50",
  "vanilla css template in:name,description stars:>50",
  "pinceau template in:name,description stars:>50",
  // Database / ORM
  "postgres template in:name,description stars:>50",
  "mysql template in:name,description stars:>50",
  "sqlite template in:name,description stars:>50",
  "mongodb template in:name,description stars:>50",
  "supabase template in:name,description stars:>50",
  "firebase template in:name,description stars:>50",
  "planetscale template in:name,description stars:>50",
  "neon database template in:name,description stars:>50",
  "turso template in:name,description stars:>50",
  "prisma template in:name,description stars:>50",
  "drizzle orm template in:name,description stars:>50",
  // Auth
  "auth0 template in:name,description stars:>50",
  "clerk template in:name,description stars:>50",
  "nextauth template in:name,description stars:>50",
  "firebase auth template in:name,description stars:>50",
  "supabase auth template in:name,description stars:>50",
  "keycloak template in:name,description stars:>50",
  "passport.js template in:name,description stars:>50",
  "lucia auth template in:name,description stars:>50",
  "stytch template in:name,description stars:>50",
  "magic.link template in:name,description stars:>50",
  "ory kratos template in:name,description stars:>50",
  "aws cognito template in:name,description stars:>50",
  "better-auth template in:name,description stars:>50",
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
  // GitHub Search API juga memberi info lisensi
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

/**
 * Konversi string ke slug URL-safe.
 * Tidak pakai @primoui/utils karena ESM-only dan tidak kompatibel dengan tsx script.
 */
function toSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Buat slug unik dengan menambahkan angka suffix jika perlu */
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
          Authorization: `Bearer ${GITHUB_TOKEN}`,
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
