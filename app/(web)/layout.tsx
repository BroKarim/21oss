import { type PropsWithChildren } from "react";
import { Shell } from "@/components/ui/shell";
export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Shell>{children}</Shell>
    </>
  );
}
