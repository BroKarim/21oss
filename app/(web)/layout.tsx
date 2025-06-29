import { type PropsWithChildren } from "react";
import { getSessionCookie } from "better-auth/cookies";
import { headers } from "next/headers";
import Providers from "./providers";
import { Container } from "@/components/ui/container";
import { getServerSession } from "@/lib/auth";
import { Header, HeaderBackdrop } from "@/components/web/header";

export default async function RootLayout({ children }: PropsWithChildren) {
  const hasSessionCookie = getSessionCookie(new Headers(await headers()));
  const session = hasSessionCookie ? await getServerSession() : null;
  return (
    <>
      <Providers>
        <div className="flex flex-col min-h-dvh  ">
          <Header session={session} />
          <HeaderBackdrop />
          <Container asChild>
            <main className="flex flex-col grow py-8 gap-8 md:gap-10 md:py-10 lg:gap-12 lg:py-12">{children}</main>
          </Container>
        </div>
      </Providers>
    </>
  );
}
