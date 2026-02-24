import CreateSeasonForm from "@/features/seasons/forms/CreateSeasonForm";
import { getSettings } from "@/features/settings/settingsFetchers";
import { getAuth } from "@/lib/getAuth";
import { getSupplies } from "@/features/supplies/suppliesFetchers";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Global.metaData");
  return {
    title: t("createSeason"),
  };
}

export default async function CreateSeasonPage({
  params,
}: {
  params: Promise<{ fieldId: string }>;
}) {
  await getAuth();
  const userSettings = await getSettings();
  const { fieldId } = await params;
  const supplies = await getSupplies();

  return (
    <CreateSeasonForm
      fieldId={fieldId}
      userSettings={userSettings}
      supplies={supplies}
    />
  );
}
