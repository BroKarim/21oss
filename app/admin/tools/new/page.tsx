import { ToolForm } from "@/app/admin/tools/_components/tool-form";
import { withAdminPage } from "@/components/admin/auth-hoc";
import { Wrapper } from "@/components/admin/wrapper";
import { findStackList } from "@/server/admin/stacks/queries";
const CreateToolPage = async () => {
  const stacks = await findStackList();
  return (
    <Wrapper size="md">
      <ToolForm title="Create tool" stacksPromise={Promise.resolve(stacks)} />
    </Wrapper>
  );
};

export default withAdminPage(CreateToolPage);
