import { withAdminPage } from "@/components/admin/auth-hoc";
import { Wrapper } from "@/components/admin/wrapper";
import { getAllUniqueTags } from "@/server/admin/free-stuff/queries";
import { FreeStuffForm } from "@/app/admin/free-stuff/_components/free-stuff-form";

const CreateFreeStuffPage = async () => {
  const allTags = await getAllUniqueTags();
  return (
    <Wrapper size="md">
      <FreeStuffForm title="Create Free Stuff" allTags={allTags} />
    </Wrapper>
  );
};

export default withAdminPage(CreateFreeStuffPage);
