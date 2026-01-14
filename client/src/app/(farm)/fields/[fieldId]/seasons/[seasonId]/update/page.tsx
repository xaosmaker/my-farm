import { getFieldById } from "@/features/fields/fieldsFetchers";
import { getSeasonById } from "@/features/seasons/fetchers";
import CreateSeasonForm from "@/features/seasons/forms/CreateSeasonForm";
import { getAllSupplies } from "@/features/supplies/getters";

export default async function UpdateSeasonPage({
  params,
}: {
  params: Promise<{ seasonId: string; fieldId: string }>;
}) {
  const { fieldId, seasonId } = await params;
  const field = await getFieldById(fieldId);
  const supplies = await getAllSupplies();
  const season = await getSeasonById(fieldId, seasonId);
  return (
    <CreateSeasonForm field={field[0]} supplies={supplies} season={season} />
  );
}
