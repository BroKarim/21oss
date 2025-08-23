import Image from "next/image";
import type { ComponentProps } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ExternalLink } from "@/components/web/external-link";
import { Container } from "@/components/ui/container";
import { cx } from "@/lib/utils";

export const AdCompact = ({ className, ...props }: ComponentProps<typeof Card>) => {
  return (
    <Container className="z-49 mt-1">
      <Card className={cx("flex-row items-center gap-3 px-3 py-2.5 md:px-4", className)} asChild {...props}>
        <ExternalLink href="https://supabase.com/?utm_source=localhost" eventName="click_ad">
          <Badge variant="outline" className="leading-none max-sm:order-last">
            Ad
          </Badge>

          <div className="text-xs leading-tight text-secondary-foreground mr-auto sm:text-sm">
            <Image src="https://www.google.com/s2/favicons?sz=96&domain_url=supabase.com" alt="supabase" width={32} height={32} className="flex float-left align-middle mr-1.5 size-3.5 rounded-sm sm:size-4" />
            <strong className="font-medium text-foreground">Supabase</strong> — The open source Firebase alternative
          </div>

          <Button variant="secondary" size="sm" className="shrink-0 leading-none pointer-events-none max-sm:hidden" asChild>
            <span>Learn More</span>
          </Button>
        </ExternalLink>
      </Card>
    </Container>
  );
};
