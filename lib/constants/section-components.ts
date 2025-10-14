import { ToolSliderGroup } from "@/components/web/tools/groups/tool-slider-groups";
import { ToolFaviconGroup } from "@/components/web/tools/groups/tool-favicon-groups";
import { ToolGalleryGroup } from "@/components/web/tools/groups/tool-gallery-groups";
import { ToolCarouselGroup } from "@/components/web/tools/groups/tool-carousel-group";
import { ToolMany } from "@/server/web/tools/payloads";

type SectionComponentProps = {
  id: string;
  label: string;
  description?: string;
  tools: ToolMany[];
  options: {
    showScroll?: boolean;
    showViewAll?: boolean;
    viewAllUrl?: string;
    loadMore?: boolean;
  };
};

export const sectionComponents = {
  slider: ToolSliderGroup,
  favicon: ToolFaviconGroup,
  gallery: ToolGalleryGroup,
  carousel: ToolCarouselGroup,
} satisfies Record<string, React.ComponentType<SectionComponentProps>>;
