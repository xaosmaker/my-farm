import ShowH1 from "@/components/ShowH1";
import { getAllActiveSeasons } from "@/features/seasons/fetchers";
import SeasonTable from "@/features/seasons/SeasonTable";

export default async function SeasonsPage() {
  const seasons = await getAllActiveSeasons();
  return (
    <>
      <ShowH1>Σεζόνς</ShowH1>
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
