import { Suspense } from "react";
import { HomeContent } from "./home-content";
import type { ToolList } from "@/server/web/tools/payloads";
import type { StackItem } from "../_lib/types";

type HomeClientProps = {
  stacks: StackItem[];
  resources: ToolList[];
  title: string;
  description: string;
};

export function HomeClient({ stacks, resources, title, description }: HomeClientProps) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
        </div>
      }
    >
      <HomeContent stacks={stacks} resources={resources} title={title} description={description} />
    </Suspense>
  );
}
