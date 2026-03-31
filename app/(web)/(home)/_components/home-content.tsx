import { Sidebar } from "./sidebar";
import { ResourceGrid } from "./resource-grid";
import type { ToolList } from "@/server/web/tools/payloads";
import type { StackItem } from "../_lib/types";

type HomeContentProps = {
  stacks: StackItem[];
  resources: ToolList[];
  title: string;
  description: string;
};

export function HomeContent({ stacks, resources, title, description }: HomeContentProps) {
  return (
    <div className="bg-background flex min-h-screen">
      <Sidebar stacks={stacks} />
      <main className="ml-[260px] flex-1">
        <ResourceGrid resources={resources} title={title} description={description} />
      </main>
    </div>
  );
}
