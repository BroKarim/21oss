import type { Metadata } from "next";
import { Suspense } from "react";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Login } from "@/components/admin/auth/login";

import { metadataConfig } from "@/config/metadata";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Join the open source community and get access to the dashboard.",
  openGraph: { ...metadataConfig.openGraph, url: "/auth/login" },
  alternates: { ...metadataConfig.alternates, canonical: "/auth/login" },
};

export default function LoginPage() {
  return (
    <>
      <CardHeader>
        <CardTitle className="p-0">{`${metadata.title}`}</CardTitle>
        <CardDescription className="md:text-sm">{metadata.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<Icon name="lucide/loader" className="animate-spin mx-auto" />}>
          <Login />
        </Suspense>
      </CardContent>
    </>
  );
}
