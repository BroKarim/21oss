// import type { SearchParams } from "nuqs/server";
// import { Suspense } from "react";
import { config } from "@/config";
import { Intro, IntroDescription, IntroTitle } from "@/components/ui/intro";

// type PageProps = {
//   searchParams: Promise<SearchParams>;
// };
export default function Home() {
  return (
    <>
      <section className="relative md:mt-4 flex flex-col justify-center gap-y-6 pb-18">
        <Intro alignment="center">
          <IntroTitle className="max-w-[16em] sm:text-4xl md:text-5xl lg:text-6xl">Discover {config.site.tagline}</IntroTitle>
          <IntroDescription className="lg:mt-2">{config.site.description}</IntroDescription>
        </Intro>
      </section>
    </>
  );
}
