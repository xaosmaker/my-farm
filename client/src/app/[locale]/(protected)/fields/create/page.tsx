import CreateFieldForm from "@/features/fields/forms/CreateFieldForm";
import { getSettings } from "@/features/settings/settingsFetchers";
import { getAuth } from "@/lib/getAuth";

export default async function CreateFieldPage() {
  await getAuth();
  const userSettings = await getSettings();
  return <CreateFieldForm userSettings={userSettings} />;
}
