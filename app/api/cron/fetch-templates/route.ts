import { NextResponse } from "next/server";
import { fetchAndSaveTemplates } from "@/lib/github/fetch-templates";

/**
 * POST /api/cron/fetch-templates
 *
 * Endpoint ini dipanggil oleh Vercel Cron (atau trigger manual)
 * untuk menjalankan GitHub template fetcher.
 *
 * Lindungi dengan CRON_SECRET agar tidak bisa dipanggil sembarangan.
 */
export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await fetchAndSaveTemplates();
    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    console.error("[cron/fetch-templates] Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
