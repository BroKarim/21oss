import { withAdminPage } from "@/components/admin/auth-hoc";
import { Wrapper } from "@/components/admin/wrapper";
import { AwesomeForm } from "../_components/awesome-form";

const CreateAwesomeList = async () => {
  return (
    <Wrapper size="md">
      <AwesomeForm title="Add new Awesome-List" />
    </Wrapper>
  );
};

export default withAdminPage(CreateAwesomeList);
