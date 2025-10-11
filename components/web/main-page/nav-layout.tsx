import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";
import { NavLogo } from "./nav-logo";
import { Sidebar, SidebarContent, SidebarHeader, SidebarRail, SidebarFooter } from "@/components/ui/sidebar";
import { AdSlot, RippleFilter } from "@/components/web/ads/ad-slot";
import { MainSidebarProps } from "@/types/sidebar";
import { findCategoriesWithChildren } from "@/server/web/categories/queries";

const data = {
  navMain: [
    {
      title: "Explore",
      url: "/",
      isActive: true,
    },
    {
      title: "Beautiful Table",
      url: "https://og-table.com/",
    },
  ],
};

export async function NavLayout({ ad, ...props }: MainSidebarProps) {
  const navSecondary = await findCategoriesWithChildren();

  const items = navSecondary.map((item) => ({
    ...item,
    icon: item.icon || "AppWindowMac",
  }));

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavLogo />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={items} />
      </SidebarContent>
      <SidebarFooter>
        <div className="p-1">
          <AdSlot ad={ad} filter={<RippleFilter />} className="ripple w-full" />
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
