import { getSettings } from "@/features/settings/settingsFetchers";
import SettingsForm from "@/features/settings/SettingsForm";
import { getAuth } from "@/lib/getAuth";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Global.metaData");
  return {
    title: t("settings"),
  };
}

export default async function page() {
  await getAuth();
  const userSettings = await getSettings();
  return <SettingsForm userSettings={userSettings} />;
}
