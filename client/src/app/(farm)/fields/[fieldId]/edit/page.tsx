import { getFieldById } from "@/features/fields/fieldsFetchers";
import CreateFieldForm from "@/features/fields/forms/CreateFieldForm";

export default async function FieldEditPage({
  params,
}: {
  params: Promise<{ fieldId: string }>;
}) {
  const { fieldId } = await params;
  const fields = await getFieldById(fieldId);
  if (fields.length !== 1) {
    return <div>No field found</div>;
  }
  return <CreateFieldForm oldData={fields[0]} />;
}
