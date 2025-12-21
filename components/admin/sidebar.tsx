"use client";

import { useMediaQuery } from "@mantine/hooks";
import { cx } from "cva";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Nav } from "@/components/admin/nav";
import { Icon } from "@/components/ui/icon";
import { signOut } from "@/lib/auth-client";

export const AdminSidebar = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const router = useRouter();

  const handleSignOut = async () => {
    signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("You've been signed out successfully");
          router.push("/");
        },
      },
    });
  };

  return (
    <Nav
      isCollapsed={!!isMobile}
      className={cx("sticky top-0 h-dvh z-40 border-r", isMobile ? "w-12" : "w-48")}
      links={[
        {
          title: "Dashboard",
          href: "/admin",
          prefix: <Icon name="lucide/layout-dashboard" />,
        },

        undefined, // Separator

        {
          title: "Tools",
          href: "/admin/tools",
          prefix: <Icon name="lucide/gem" />,
        },

        {
          title: "Categories",
          href: "/admin/categories",
          prefix: <Icon name="lucide/tags" />,
        },
        {
          title: "Ads",
          href: "/admin/ads",
          prefix: <Icon name="lucide/users" />,
        },
        {
          title: "Free Stuff",
          href: "/admin/free-stuff",
          prefix: <Icon name="lucide/users" />,
        },

        {
          title: "Curated Lists",
          href: "/admin/curated-lists",
          prefix: <Icon name="lucide/users" />,
        },
        
        undefined,
        {
          title: "Sign Out",
          href: "#",
          onClick: handleSignOut,
          prefix: <Icon name="lucide/log-out" />,
        },
      ]}
    />
  );
};
