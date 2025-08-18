import { notFound } from "next/navigation";
import { AdForm } from "../_components/ad-form";
import { Wrapper } from "@/components/admin/wrapper";
import { findAdById } from "@/server/admin/ads/queries";

type PageProps = { params: { slug: string } };

const UpdateAdPage = async ({ params }: PageProps) => {
  const { slug } = params;
  const ad = await findAdById(slug);

  if (!ad) {
    return notFound();
  }

  return (
    <Wrapper size="md">
      <AdForm title={`Edit Ad: ${ad.name}`} ad={ad} />
    </Wrapper>
  );
};

export default UpdateAdPage;
