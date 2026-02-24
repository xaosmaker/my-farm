import CreateFieldForm from "@/features/fields/forms/CreateFieldForm";
import { getSettings } from "@/features/settings/settingsFetchers";
import { getAuth } from "@/lib/getAuth";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Global.metaData");
  return {
    title: t("createField"),
  };
}

export default async function CreateFieldPage() {
  await getAuth();
  const userSettings = await getSettings();
  return <CreateFieldForm userSettings={userSettings} />;
}
