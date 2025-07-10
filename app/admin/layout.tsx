import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: "Admin Panel",
};

export default function DashboardLayout({ children }: PropsWithChildren) {
  return <div className="grid grid-cols-1 content-start gap-4 p-4 flex-1 sm:px-6">{children}</div>;
}
