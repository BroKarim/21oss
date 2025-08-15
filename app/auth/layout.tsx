import type { PropsWithChildren } from "react";
import { Card } from "@/components/ui/card";

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Card className="w-full max-w-sm">{children}</Card>
    </div>
  );
}
