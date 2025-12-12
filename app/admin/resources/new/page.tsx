import { ResourceForm } from "@/app/admin/resources/_components/resource-form";
import { withAdminPage } from "@/components/admin/auth-hoc";
import { Wrapper } from "@/components/admin/wrapper";

const CreateResourcePage = async () => {
  return (
    <Wrapper size="md">
      <ResourceForm title="Create Resource" />
    </Wrapper>
  );
};

export default withAdminPage(CreateResourcePage);
