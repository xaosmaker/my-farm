import GeneralPageError from "@/components/GeneralPageError";
import ShowFieldPage from "@/components/ShowFieldPage";
import { getSettings } from "@/features/userSettings/fetchers";
import SettingsForm from "@/features/userSettings/SettingsForm";

export default async function SettingsPage() {
  const userSettings = await getSettings();
  if (!userSettings) {
    return <GeneralPageError title="Settings Error" />;
  }

  return (
    <ShowFieldPage title="Ρυθμίσεις">
      <SettingsForm settings={userSettings} />
    </ShowFieldPage>
  );
}
