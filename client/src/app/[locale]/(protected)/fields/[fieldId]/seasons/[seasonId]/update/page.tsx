import CreateSeasonForm from "@/features/seasons/forms/CreateSeasonForm";
import { getSettings } from "@/features/settings/settingsFetchers";
import { getAuth } from "@/lib/getAuth";
import { getSupplies } from "@/features/supplies/suppliesFetchers";
import { getSeason } from "@/features/seasons/seasonFetchers";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Global.metaData");
  return {
    title: `${t("updateSeason")}`,
  };
}

export default async function UpdateSeasonPage({
  params,
}: {
  params: Promise<{ fieldId: string; seasonId: string }>;
}) {
  const session = await getAuth();
  const userSettings = await getSettings();
  const { fieldId, seasonId } = await params;
  const supplies = await getSupplies();
  const season = await getSeason(seasonId, session.user!.intl);

  return (
    <CreateSeasonForm
      fieldId={fieldId}
      userSettings={userSettings}
      supplies={supplies}
      season={season}
    />
  );
}
