import { Separator } from "@/components/ui/separator";
import FieldDetailPage from "@/features/fields/components/FieldDetailPage";
import { getField } from "@/features/fields/fieldFetchers";
import { getSeasons } from "@/features/seasons/seasonFetchers";
import SeasonsTable from "@/features/seasons/SeasonsTable";
import { getSettings } from "@/features/settings/settingsFetchers";
import { getAuth } from "@/lib/getAuth";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Global.metaData");
  return {
    title: t("field"),
  };
}

export default async function FieldPage({
  params,
}: {
  params: Promise<{ fieldId: string }>;
}) {
  const session = await getAuth();
  const { fieldId } = await params;
  const field = await getField(fieldId, true, session.user!.intl);
  const userSettings = await getSettings();
  const seasons = await getSeasons(session.user!.intl);

  return (
    <>
      <FieldDetailPage field={field} userSetting={userSettings} />
      <Separator className="my-10" />
      <SeasonsTable seasonData={seasons} />
    </>
  );
}
