import { getFieldById } from "@/features/fields/fieldsFetchers";
import DynamicCreateFieldForm from "@/features/fields/forms/DynamicCreateFieldForm";

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
  return <DynamicCreateFieldForm oldData={fields[0]} />;
}
