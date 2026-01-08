import ShowFieldPage from "@/components/ShowFieldPage";
import { getSettings } from "@/features/userSettings/fetchers";
import SettingsForm from "@/features/userSettings/SettingsForm";

export default async function SettingsPage() {
  const userSettings = await getSettings();

  return (
    <ShowFieldPage title="Ρυθμίσεις">
      <SettingsForm settings={userSettings} />
    </ShowFieldPage>
  );
}
