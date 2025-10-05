import type { AdType } from "@prisma/client";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink } from "@/components/web/external-link";
import { FaviconImage } from "@/components/ui/favicon";
import { findAd } from "@/server/web/ads/queries";
import { RainbowButton } from "@/components/ui/rainbow-button";


type AdButtonProps = Omit<ComponentProps<typeof RainbowButton>, "type"> & {
  type: AdType;
};

const AdButton = async ({ type, ...props }: AdButtonProps) => {
  const ad = await findAd({ where: { type } });

  if (!ad) return null;

  const icon = ad.faviconUrl ? <FaviconImage src={ad.faviconUrl} title={ad.name} className="size-4" /> : <Icon name="lucide/arrow-up-right" />;

  return (
    <RainbowButton className=" text-white"  prefix={icon} {...props}>
      <ExternalLink href={ad.websiteUrl} eventName="click_ad" eventProps={{ url: ad.websiteUrl, type: ad.type, source: "button" }}>
        {ad.buttonLabel ?? `Visit ${ad.name}`}
      </ExternalLink>
    </RainbowButton>
  );
};

const AdButtonSkeleton = ({ ...props }: ComponentProps<typeof Button>) => {
  return (
    <Button variant="secondary" {...props}>
      <Skeleton>&nbsp;</Skeleton>
    </Button>
  );
};

export { AdButton, AdButtonSkeleton };
