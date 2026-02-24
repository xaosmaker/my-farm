import { getField } from "@/features/fields/fieldFetchers";
import CreateFieldForm from "@/features/fields/forms/CreateFieldForm";
import { getSettings } from "@/features/settings/settingsFetchers";
import { getAuth } from "@/lib/getAuth";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Global.metaData");
  return {
    title: t("updateField"),
  };
}

export default async function UpdateFieldPage({
  params,
}: {
  params: Promise<{ fieldId: string }>;
}) {
  await getAuth();
  const { fieldId } = await params;
  const userSettings = await getSettings();
  const field = await getField(fieldId);

  return <CreateFieldForm userSettings={userSettings} userField={field} />;
}
