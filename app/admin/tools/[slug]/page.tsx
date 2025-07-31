import { notFound } from "next/navigation";
import { ToolForm } from "@/app/admin/tools/_components/tool-form";
// import { withAdminPage } from "@/components/admin/auth-hoc";
import { Wrapper } from "@/components/admin/wrapper";
import { findCategoryList } from "@/server/admin/categories/queries";
import { findPlatformList } from "@/server/admin/platforms/queries";
import { findToolBySlug } from "@/server/admin/tools/queries";
import { findStackList } from "@/server/admin/stacks/queries";
type PageProps = {
  params: Promise<{ slug: string }>;
};

// halaman detaiol untuk edit satu tool, base on slug
const UpdateToolPage = async ({ params }: PageProps) => {
  const { slug } = await params;
  const tool = await findToolBySlug(slug);

  if (!tool) {
    return notFound();
  }

  return (
    <Wrapper size="md">
      <ToolForm
        title={`Edit ${tool.name}`}
        tool={tool}
        categoriesPromise={findCategoryList()}
        platformsPromise={findPlatformList()}
        stacksPromise={findStackList()}
      />
    </Wrapper>
  );
};

export default UpdateToolPage;
// export default withAdminPage(UpdateToolPage);
