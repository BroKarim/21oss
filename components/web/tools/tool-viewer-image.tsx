import Image from "next/image";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ScreenshotType } from "@/types/globals";

interface ToolViewerImageProps {
  screenshots: ScreenshotType[];
}

export function ToolViewerImage({ screenshots }: ToolViewerImageProps) {
  console.debug("Received screenshots:", screenshots);
  const groupedScreenshots = screenshots.reduce(
    (acc, screenshot) => {
      const { page } = screenshot;
      // Gunakan fallback jika page undefined
      const pageKey = page ?? "uncategorized";
      console.debug(`Processing screenshot for page: ${pageKey}`);
      if (!acc[pageKey]) {
        acc[pageKey] = [];
      }
      acc[pageKey].push(screenshot);
      acc[pageKey].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      return acc;
    },
    {} as Record<string, typeof screenshots>
  );

  if (screenshots.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-[#7d8590]">
          <h3 className="text-lg font-medium mb-2">No screenshots available</h3>
          <p className="text-sm">This category doesn’t contain any screenshots yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className=" flex flex-col gap-4">
      {Object.entries(groupedScreenshots).map(([page, screenshots]) => (
        <div key={page} className="space-y-4">
          <h3 className="font-semibold text-lg capitalize">{page}</h3>
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex gap-6  pb-4">
              {screenshots.map((screenshot) => (
                <div key={screenshot.id} className="flex-shrink-0 group cursor-pointer">
                  <div className="relative w-[1000px] h-[600px] rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl">
                    <Image src={screenshot.imageUrl} alt={screenshot.caption ?? `Screenshot ${page}`} fill className="object-cover" sizes="(max-width: 600px) 100vw, 600px" />
                  </div>
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      ))}
    </div>
  );
}
