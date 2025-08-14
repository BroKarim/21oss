import { getSessionCookie } from "better-auth/cookies";
import { headers } from "next/headers";
import type { Metadata } from "next";
import type { PropsWithChildren } from "react";
import { getServerSession } from "@/lib/auth";
import { Header } from "@/components/admin/header";
export const metadata: Metadata = {
  title: "Admin Panel",
};

export default async function DashboardLayout({ children }: PropsWithChildren) {
  const hasSessionCookie = getSessionCookie(new Headers(await headers()));
  const session = hasSessionCookie ? await getServerSession() : null;
  return (
    <>
      <div className=" flex flex-col">
        <Header session={session} />
        <div className="grid grid-cols-1 content-start gap-4 p-4 flex-1 sm:px-6">{children}</div>
      </div>
    </>
  );
}
