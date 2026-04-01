import { findFreeStuffPerks } from "@/server/web/free-stuff/queries";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { StudentClientWrapper } from "@/components/web/student/client-wrapper";
import { Suspense } from "react";
import { getStackFilters } from "@/server/web/tools/actions";
import { WebShell } from "../_components/web-shell";

export const metadata: Metadata = {
  title: "Free & Discounted Tools for Students",
  description: "A curated collection of tools, platforms, and services offering free access or special discounts for students.",
  openGraph: {
    title: "Free & Discounted Tools for Students · 21OSS",
    description: "Discover tools and services that provide free plans or exclusive discounts for students.",
    url: `${siteConfig.url}/for-students`,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "Student Deals and Free Tools by 21OSS",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free & Discounted Tools for Students · 21OSS",
    description: "Student-friendly tools, services, and platforms with free access or discounts.",
    images: [siteConfig.ogImage],
  },
};

export default async function CollagePage() {
  const perks = await findFreeStuffPerks({});
  const stacks = await getStackFilters();

  return (
    <WebShell stacks={stacks}>
      <div className="min-h-screen bg-background/50 px-4 py-10 md:px-8">
        <div className="mx-auto max-w-6xl">
          <Suspense fallback={<div className="h-64 animate-pulse rounded-xl bg-muted" />}>
            <StudentClientWrapper initialData={perks} />
          </Suspense>
        </div>
      </div>
    </WebShell>
  );
}
