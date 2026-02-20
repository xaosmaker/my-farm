import CreateFieldForm from "@/features/fields/forms/CreateFieldForm";
import { getSettings } from "@/features/settings/settingsFetchers";

export default async function CreateFieldPage() {
  const userSettings = await getSettings();
  return <CreateFieldForm userSettings={userSettings} />;
}
