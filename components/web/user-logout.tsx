"use client";

import { useRouter } from "next/navigation";
import type { ComponentProps } from "react";
import { toast } from "sonner";
import { Icon } from "../ui/icon";
import { navLinkVariants } from "./nav-link";
import { signOut } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

export const UserLogout = ({ className, ...props }: ComponentProps<"button">) => {
  const router = useRouter();

  const handleSignOut = async () => {
    signOut({
      fetchOptions: {
        onSuccess: () => {
          router.refresh();
          toast.success("You've been signed out successfully");
        },
      },
    });
  };

  return (
    <button type="button" className={cn(navLinkVariants({ className }))} {...props} onClick={handleSignOut}>
      <Icon name="lucide/log-out" className="shrink-0 size-4 opacity-75" />
      Logout
    </button>
  );
};
