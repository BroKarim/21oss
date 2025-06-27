import { type PropsWithChildren } from "react";
import Providers from "./providers";
import { Container } from "@/components/ui/container";
export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Providers>
        <div className="flex flex-col min-h-dvh overflow-clip pt-(--header-offset)">
          <Container asChild>
            <main className="flex flex-col grow py-8 gap-8 md:gap-10 md:py-10 lg:gap-12 lg:py-12">{children}</main>
          </Container>
        </div>
      </Providers>
    </>
  );
}
