import { ResourceCard } from "@/components/web/tools/resources/resources-card";
import { findResources } from "@/server/web/tools/queries";
import type { ResourcesParams } from "@/server/web/shared/schema";

export async function ResourcesList({ params }: { params: ResourcesParams }) {
  const resources = await findResources(params);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {resources.map((tool) => (
        <ResourceCard key={tool.id} tool={tool} />
      ))}
    </div>
  );
}
