// app/admin/awesome/[slug]/page.tsx
import { notFound } from "next/navigation";
import { Wrapper } from "@/components/admin/wrapper";
import { AwesomeForm } from "../_components/awesome-form";
import { findAwesomeListById } from "@/server/admin/awesome-list/queries";

type PageProps = { params: { slug: string } };

const UpdateAwesomePage = async ({ params }: PageProps) => {
  const { slug } = await params;
  const awesome = await findAwesomeListById(slug);

  if (!awesome) {
    return notFound();
  }

  return (
    <Wrapper size="md">
      <AwesomeForm title={`Edit Awesome: ${awesome.name}`} awesome={awesome} />
    </Wrapper>
  );
};

export default UpdateAwesomePage;
