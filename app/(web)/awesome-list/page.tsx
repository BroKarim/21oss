// import FrameScrambleText from "@/components/web/frame-scramble-text";

import AwesomeCard from "@/components/web/card/awesome-card";
import WidgetBanner from "@/components/web/ui/banner";
export default function Page() {
  return (
    <main className="flex flex-1 flex-col overflow-hidden">
      <div className="container p-4 space-y-6">
        <WidgetBanner />
        <div className="grid grid-cols-2 gap-4">
          <AwesomeCard />
          <AwesomeCard />
          <AwesomeCard />
          <AwesomeCard />
          <AwesomeCard />
          <AwesomeCard />
        </div>
      </div>
    </main>
  );
}
