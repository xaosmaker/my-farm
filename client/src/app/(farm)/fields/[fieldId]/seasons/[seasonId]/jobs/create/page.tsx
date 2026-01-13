import CreateJobForm from "@/features/jobs/forms/CreateJobForm";
import { getSeasonById } from "@/features/seasons/fetchers";
import { getAllSupplies } from "@/features/supplies/getters";

export default async function CreateJobPage({
  params,
}: {
  params: Promise<{ fieldId: string; seasonId: string }>;
}) {
  const { seasonId, fieldId } = await params;
  const season = await getSeasonById(fieldId, seasonId);
  const supplies = await getAllSupplies();
  if (!season) {
    return <div>Season not Found</div>;
  }

  return (
    <CreateJobForm
      fieldId={parseInt(fieldId)}
      season={season}
      supplies={supplies}
    />
  );
}
