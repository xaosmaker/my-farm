import ShowH1 from "@/components/ShowH1";
import { getAllActiveSeasons } from "@/features/seasons/fetchers";
import SeasonTable from "@/features/seasons/SeasonTable";
import { getTranslations } from "next-intl/server";

export default async function SeasonsPage() {
  const seasons = await getAllActiveSeasons();
  const t = await getTranslations("Seasons");
  return (
    <>
      <ShowH1>{t("pageTitle")}</ShowH1>

      <SeasonTable
        seasonsData={seasons}
        showColumns={{
          landUnit: false,
          finishSeason: false,
        }}
      />
    </>
  );
}
