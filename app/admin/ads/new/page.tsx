import { withAdminPage } from "@/components/admin/auth-hoc";
import { Wrapper } from "@/components/admin/wrapper";
import { AdForm } from "../_components/ad-form";

const CreateAd = async () => {
  return (
    <Wrapper size="md">
      <AdForm title="Create Ad" />
    </Wrapper>
  );
};

export default withAdminPage(CreateAd);
