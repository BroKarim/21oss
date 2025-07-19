import Image from "next/image";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ScreenshotType } from "@/types/globals";


interface ToolViewerImageProps {
  screenshots: ScreenshotType[];
}

export function ToolViewerImage({ screenshots }: ToolViewerImageProps) {
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
    <div className="flex-1 overflow-hidden">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-6 px-6 pb-4">
          {screenshots.map((screenshot) => (
            <div key={screenshot.id} className="flex-shrink-0 group cursor-pointer">
              <div className="relative w-[280px] h-[560px] rounded-2xl overflow-hidden bg-black shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-3xl">
                <Image src={screenshot.imageUrl} alt={screenshot.caption} fill className="object-cover transition-transform duration-300 group-hover:scale-110" sizes="280px" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
