import { DataTable } from "@/components/data-table";
import ShowH1 from "@/components/ShowH1";
import { getAllActiveSeasons } from "@/features/seasons/fetchers";
import { seasonsTable } from "@/features/seasons/seasonTable";

export default async function SeasonsPage() {
  const seasons = await getAllActiveSeasons();
  return (
    <>
      <ShowH1>Σεζόνς</ShowH1>
      <DataTable
        data={seasons}
        columns={seasonsTable}
        showColumns={{
          landUnit: false,
          finishSeason: false,
        }}
      />
    </>
  );
}
