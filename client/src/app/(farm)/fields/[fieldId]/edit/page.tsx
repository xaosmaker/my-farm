import { getFieldById } from "@/features/fields/fieldsFetchers";
import CreateFieldForm from "@/features/fields/forms/CreateFieldForm";
import { getSettings } from "@/features/userSettings/fetchers";

export default async function FieldEditPage({
  params,
}: {
  params: Promise<{ fieldId: string }>;
}) {
  const { fieldId } = await params;
  const field = await getFieldById(fieldId);
  const userSettings = await getSettings();
  if (!field) {
    throw new Error("you can't update a field that not exist");
  }
  return <CreateFieldForm oldData={field} landUnit={userSettings} />;
}
