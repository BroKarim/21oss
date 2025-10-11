"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton } from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Icons } from "../icons";

const iconMap = {
  0: Icons.robot,
  1: Icons.design,
  2: Icons.marketing,
  3: Icons.productive,
  4: Icons.code,
};

function useHash() {
  const [hash, setHash] = useState(typeof window !== "undefined" ? window.location.hash : "");
  useEffect(() => {
    const updateHash = () => setHash(window.location.hash);
    window.addEventListener("hashchange", updateHash);
    return () => window.removeEventListener("hashchange", updateHash);
  }, []);
  return hash;
}

export function NavSecondary({
  items,
}: {
  items: {
    title: string;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const pathname = usePathname();
  const hash = useHash();
  const [activeItem, setActiveItem] = useState<number | null>(null);

  useEffect(() => {
    const currentFullPath = `${pathname}${hash}`;
    const foundIndex = items.findIndex((group) => group.items?.some((sub) => currentFullPath.startsWith(sub.url)));
    if (foundIndex !== -1) {
      setActiveItem(foundIndex);
    } else {
      const defaultIndex = items.findIndex((item) => item.isActive);
      setActiveItem(defaultIndex !== -1 ? defaultIndex : null);
    }
  }, [pathname, hash, items]);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Filter</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item, index) => {
          const Icon = iconMap[index as keyof typeof iconMap];

          return (
            <Collapsible key={item.title} asChild open={activeItem === index} onOpenChange={(isOpen) => setActiveItem(isOpen ? index : null)}>
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={`transition-colors ${
                      activeItem === index
                        ? `text-white
                    bg-gradient-to-r from-white/20 via-white/10 to-white/5
                    transition-colors shadow-[inset_0_1px_rgb(255_255_255/0.15)]
                    border-none
                    backdrop-blur-sm`
                        : "text-white/60 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {Icon && <Icon className="mr-2 h-4 w-4" />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild className={`transition-colors ${`${pathname}${hash}` === subItem.url ? "text-white font-medium" : "text-white/60 hover:text-white hover:bg-white/10"}`}>
                          <a href={subItem.url}>
                            <span>{subItem.title}</span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
