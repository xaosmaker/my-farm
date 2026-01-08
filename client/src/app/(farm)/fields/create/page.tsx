import CreateFieldForm from "@/features/fields/forms/CreateFieldForm";
import { getSettings } from "@/features/userSettings/fetchers";

export default async function CreateFieldPage() {
  const userSettings = await getSettings();
  return <CreateFieldForm landUnit={userSettings} />;
}
