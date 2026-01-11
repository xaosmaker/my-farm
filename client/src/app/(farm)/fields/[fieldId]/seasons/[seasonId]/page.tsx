import ShowFieldGroup from "@/components/ShowFieldGroup";
import ShowFieldPage from "@/components/ShowFieldPage";
import ShowFieldsData from "@/components/ShowFieldsData";
import { getSeasonById } from "@/features/seasons/fetchers";
import { engToGreek } from "@/lib/translateMap";

export default async function SeasonPage({
  params,
}: {
  params: Promise<{ fieldId: string; seasonId: string }>;
}) {
  const { seasonId, fieldId } = await params;

  const season = await getSeasonById(fieldId, seasonId);
  if (!season) {
    return <div>No resourse found</div>;
  }
  console.log(season);
  return (
    <ShowFieldPage title={season.fieldName}>
      <ShowFieldGroup groupName="Λεπτομέρειες">
        <ShowFieldsData fieldName="ποικιλία" value={season.cropName} />
        <ShowFieldsData
          fieldName="Καλλιεργούνται"
          value={`${season.areaInMeters.toString()} από τα ${season.fieldAreaInMeters.toString()} ${engToGreek.get(season.landUnit)}`}
        />
        <ShowFieldsData
          fieldName="Αρχή καλλιέργειάς"
          value={season.startSeason}
        />

        <ShowFieldsData
          fieldName="Τέλος καλλιέργειάς"
          value={season.finishSeason || ""}
        />
      </ShowFieldGroup>
    </ShowFieldPage>
  );
}
