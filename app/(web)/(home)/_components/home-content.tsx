import { ResourceGrid } from "./resource-grid";
import type { ToolList } from "@/server/web/tools/payloads";
import type { StackItem } from "../_lib/types";
import { WebShell } from "../../_components/web-shell";

type HomeContentProps = {
  stacks: StackItem[];
  resources: ToolList[];
  title: string;
  description: string;
};

export function HomeContent({ stacks, resources, title, description }: HomeContentProps) {
  return (
    <WebShell stacks={stacks}>
      <div className="min-h-screen">
        <ResourceGrid resources={resources} title={title} description={description} />
      </div>
    </WebShell>
  );
}
