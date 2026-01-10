import { getFieldById } from "@/features/fields/fieldsFetchers";
import CreateSeasonForm from "@/features/seasons/forms/CreateSeasonForm";
import { getAllSupplies } from "@/features/supplies/getters";

export default async function CreateSeasonPage({
  params,
}: {
  params: Promise<{ fieldId: string }>;
}) {
  const { fieldId } = await params;
  const field = await getFieldById(fieldId);
  const supplies = await getAllSupplies();

  return <CreateSeasonForm field={field[0]} supplies={supplies} />;
}
