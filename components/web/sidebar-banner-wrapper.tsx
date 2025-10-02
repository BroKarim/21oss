// SidebarAdsWrapper.tsx (client wrapper)
"use client";
import dynamic from "next/dynamic";
import { RippleFilter } from "./ads/sidebar-banner";
// dynamic import biar server component bisa dipakai di client tree
const SidebarBanner = dynamic(() => import("./ads/sidebar-banner").then((m) => m.SidebarBanner), {
  ssr: true,
});

export function SidebarAdsWrapper(props: { className?: string; filter?: React.ReactNode }) {
  return <SidebarBanner filter={<RippleFilter />} className="ripple w-full" />;
}
