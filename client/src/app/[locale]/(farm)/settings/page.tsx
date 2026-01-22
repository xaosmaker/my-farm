import ShowFieldPage from "@/components/ShowFieldPage";
import { getSettings } from "@/features/userSettings/fetchers";
import SettingsForm from "@/features/userSettings/SettingsForm";
import { getTranslations } from "next-intl/server";

export default async function SettingsPage() {
  const t = await getTranslations("Settings");
  const userSettings = await getSettings();

  return (
    <ShowFieldPage title={t("pageTitle")}>
      <SettingsForm settings={userSettings} />
    </ShowFieldPage>
  );
}
