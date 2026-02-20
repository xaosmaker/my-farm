import { getField } from "@/features/fields/fieldFetchers";
import CreateFieldForm from "@/features/fields/forms/CreateFieldForm";
import { getSettings } from "@/features/settings/settingsFetchers";

export default async function UpdateFieldPage({
  params,
}: {
  params: Promise<{ fieldId: string }>;
}) {
  const { fieldId } = await params;
  const userSettings = await getSettings();
  const field = await getField(fieldId);

  return <CreateFieldForm userSettings={userSettings} userField={field} />;
}
