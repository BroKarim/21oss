import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { fetchAndSaveTemplates } from "@/lib/github/fetch-templates";

/**
 * POST /api/cron/fetch-templates
 *
 * Endpoint ini dipakai trigger manual dari Admin.
 * Hanya user dengan role admin yang boleh menjalankan fetcher.
 */
export async function POST() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session?.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await fetchAndSaveTemplates();
    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    console.error("[manual/fetch-templates] Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
