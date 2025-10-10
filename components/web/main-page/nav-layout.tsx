
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
      icon: "LayoutGrid",
      isActive: true,
    },
    {
      title: "Beautiful Table",
      url: "https://og-table.com/",
      icon: "LayoutPanelTop",
    },
  ],
  // navSecondary: [
  //   {
  //     title: "Programming",
  //     icon: AppWindowMac,
  //     isActive: true,
  //     items: [
  //       { title: "APIs & Integration", url: "/categories/programming#apis-and-integration" },
  //       { title: "Backend", url: "/categories/programming#backend" },
  //       { title: "Dev Tools", url: "/categories/programming#dev-tools" },
  //       { title: "Frontend", url: "/categories/programming#frontend" },
  //     ],
  //   },
  //   {
  //     title: "AI",
  //     icon: BotMessageSquare,
  //     isActive: true,
  //     items: [
  //       { title: "Agents & Automation", url: "/categories/ai#agents-and-automation" },
  //       { title: "Generative AI", url: "/categories/ai#generative-ai" },
  //       { title: "LLM Ecosystem", url: "/categories/ai#llm-ecosystem" },
  //     ],
  //   },
  //   {
  //     title: "Marketing",
  //     icon: DiamondPercent,
  //     isActive: true,
  //     items: [
  //       { title: "Analytics & Tracking", url: "/categories/marketing#analytics" },
  //       { title: "Email", url: "/categories/marketing#email" },
  //       { title: "Content", url: "/categories/marketing#social-media" },
  //     ],
  //   },
  //   {
  //     title: "Design",
  //     icon: Palette,
  //     isActive: true,
  //     items: [
  //       { title: "3D & Motion", url: "/categories/design#3d-and-motion" },
  //       { title: "Asset Generators", url: "/categories/design#asset" },
  //       { title: "Colors", url: "/categories/design#colors" },
  //       { title: "Typography", url: "/categories/design#typography" },
  //       { title: "UI/UX", url: "/categories/design#ui-ux" },
  //       { title: "Utility & Software", url: "/categories/design#utility-and-software" },
  //     ],
  //   },
  // ],
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
