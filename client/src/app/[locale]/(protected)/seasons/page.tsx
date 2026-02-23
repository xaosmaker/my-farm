import SeasonsTable from "@/features/seasons/SeasonsTable";
import { getAuth } from "@/lib/getAuth";
import { getSeasons } from "@/features/seasons/seasonFetchers";
import H1 from "@/components/H1";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Global.metaData");
  return {
    title: t("Seasons"),
  };
}

export default async function SeasonPage() {
  const session = await getAuth();
  const t = await getTranslations("Global.metaData");

  const seasonData = await getSeasons(session.user!.intl);
  return (
    <>
      <H1 className="mb-10 text-center">{t("Seasons")}</H1>
      <SeasonsTable seasonData={seasonData} />
    </>
  );
}
