// import FrameScrambleText from "@/components/web/frame-scramble-text";

import { AwesomeQuery } from "@/components/web/awesome-list/awesome-query";
import WidgetBanner from "@/components/web/ui/banner";
export default function Page() {
  return (
    <main className="flex flex-1 flex-col overflow-hidden">
      <div className="container p-4 space-y-6">
        <WidgetBanner />
        <AwesomeQuery />
      </div>
    </main>
  );
}
