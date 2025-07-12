import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { H2 } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";
import { Link } from "@/components/ui/link";
import { Stack } from "@/components/ui/stack";
import { Markdown } from "@/components/web/markdown";
import { OverlayImage } from "@/components/web/overlay-image";
import { ToolBadges } from "@/components/web/tools/tool-badges";
import { FaviconImage } from "@/components/ui/favicon";
import { VerifiedBadge } from "@/components/web/verified-badge";
import type { ToolManyExtended, ToolOne } from "@/server/web/tools/payloads";
import { cx } from "@/lib/utils";

type ToolEntryProps = ComponentProps<"div"> & {
  tool: ToolOne | ToolManyExtended;
};

const ToolEntry = ({ children, className, tool, ...props }: ToolEntryProps) => {
  const href = `/${tool.slug}`;

  return (
    <div className={cx("flex flex-col gap-6 scroll-mt-20 md:gap-8 [counter-increment:entries]", className)} {...props}>
      <Stack size="lg" className="not-prose relative justify-between">
        <Stack className="self-start before:content-['#'_counter(entries)] before:font-semibold before:text-3xl before:opacity-25 xl:before:absolute xl:before:right-full xl:before:mr-4" asChild>
          <Link href={href} className="group">
            <FaviconImage src={tool.faviconUrl} title={tool.name} className="size-8" />

            <H2 className="leading-tight! truncate underline decoration-transparent group-hover:decoration-foreground/30">{tool.name}</H2>

            {tool.ownerId && <VerifiedBadge size="lg" />}
          </Link>
        </Stack>

        <ToolBadges tool={tool} className="ml-auto" />
      </Stack>

      {tool.description && <p className="not-prose -mt-4 w-full text-secondary-foreground text-pretty md:text-lg md:-mt-6">{tool.description}</p>}

      {tool.screenshotUrl && (
        <OverlayImage href={href} target="_self" doFollow={true} src={tool.screenshotUrl} alt={`Screenshot of ${tool.name} website`} className="not-prose">
          Read more
        </OverlayImage>
      )}

      {children ? <div>{children}</div> : tool.content && <Markdown code={tool.content} className="relative max-h-72 overflow-hidden mask-b-from-80%" />}

      <Button suffix={<Icon name="lucide/arrow-right" />} className="not-prose self-start" asChild>
        <Link href={href}>Read more</Link>
      </Button>
    </div>
  );
};

export { ToolEntry };
