import { findAd } from "@/server/web/ads/queries";
import { NavLayout } from "@/components/web/main-page/nav-layout"; 

export async function UserSidebar() {
  const ad = await findAd({ where: { type: "SidebarBanner" } });

  return <NavLayout ad={ad} />;
}
