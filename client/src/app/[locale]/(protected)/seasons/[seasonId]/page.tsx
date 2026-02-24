import SeasonDetailPage from "@/features/seasons/components/SeasonDetailPage";
import { getSeason } from "@/features/seasons/seasonFetchers";
import { getAuth } from "@/lib/getAuth";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Global.metaData");
  return {
    title: t("seasons"),
  };
}

export default async function SeasonPage({
  params,
}: {
  params: Promise<{ seasonId: string }>;
}) {
  const session = await getAuth();
  const { seasonId } = await params;
  const season = await getSeason(seasonId, session.user!.intl);

  return <SeasonDetailPage season={season} />;
}
