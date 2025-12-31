import CreateJobForm from "@/features/jobs/forms/CreateJobForm";
import { getAllSupplies } from "@/features/supplies/getters";

export default async function CreateJobPage({
  params,
}: {
  params: Promise<{ fieldId: string }>;
}) {
  const { fieldId } = await params;
  const supplies = await getAllSupplies();

  return <CreateJobForm fieldId={parseInt(fieldId)} supplies={supplies} />;
}
