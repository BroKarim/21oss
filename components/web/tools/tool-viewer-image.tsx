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
    <div className="flex flex-col h-full">
      {Object.entries(groupedScreenshots).map(([page, screenshots]) => (
        <div key={page} className="flex flex-col h-full">
          {/* Header */}
          <div className="mb-4">
            <h2 className="text-2xl font-semibold  capitalize">{page}</h2>
            <p className="text-sm text-gray-600 mt-1">{screenshots.length} screens</p>
          </div>

          {/* Horizontal scroll area */}
          <ScrollArea className="flex-1 w-full">
            <div className="flex gap-6 pb-4 h-full items-center">
              {screenshots.map((screenshot) => (
                <div key={screenshot.id} className="flex-shrink-0 group cursor-pointer">
                  <div className="relative w-[420px] h-[300px] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-200 bg-white border border-gray-200">
                    <Image src={screenshot.imageUrl} alt={screenshot.caption ?? `Screenshot ${page}`} fill className="object-cover" sizes="320px" />
                  </div>
                  {/* Optional: Add caption below image */}
                  {screenshot.caption && <p className="text-sm text-gray-600 mt-2 text-center max-w-[320px] truncate">{screenshot.caption}</p>}
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
