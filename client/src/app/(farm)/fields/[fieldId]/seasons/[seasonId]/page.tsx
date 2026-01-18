import { DataTable } from "@/components/data-table";
import DeleteItem from "@/components/DeleteItem";
import EditItem from "@/components/EditItem";
import ShowFieldGroup from "@/components/ShowFieldGroup";
import ShowFieldPage from "@/components/ShowFieldPage";
import ShowFieldsData from "@/components/ShowFieldsData";
import ShowFieldsDate from "@/components/ShowFieldsDate";
import { GetAllJobs } from "@/features/jobs/jobsFetchers";
import { jobsTable } from "@/features/jobs/jobsTable";
import { deleteSeasonAction } from "@/features/seasons/actions/seasonActions";
import { getSeasonById } from "@/features/seasons/fetchers";
import { engToGreek } from "@/lib/translateMap";

export default async function SeasonPage({
  params,
}: {
  params: Promise<{ fieldId: string; seasonId: string }>;
}) {
  const { seasonId, fieldId } = await params;

  const jobs = await GetAllJobs(seasonId);
  const season = await getSeasonById(fieldId, seasonId);
  if (!season) {
    return <div>No resourse found</div>;
  }
  return (
    <>
      <ShowFieldPage title={`Σεζόν ${season.fieldName}`}>
        <ShowFieldGroup groupName="Λεπτομέρειες">
          <ShowFieldsData fieldName="ποικιλία" value={season.cropName} />
          <ShowFieldsData
            fieldName="Καλλιεργούνται"
            value={`${season.areaInMeters.toString()} από τα ${season.fieldAreaInMeters.toString()} ${engToGreek.get(season.landUnit)}`}
          />
          <ShowFieldsDate
            fieldName="Αρχή καλλιέργειάς"
            value={season.startSeason}
          />

          <ShowFieldsDate
            fieldName="Τέλος καλλιέργειάς"
            value={season.finishSeason}
          />
        </ShowFieldGroup>
        <ShowFieldGroup groupName="Actions" className="col-span-full">
          <DeleteItem
            id={season.id.toString()}
            name={season.name}
            formAction={deleteSeasonAction}
          />
          <EditItem url={`/fields/${fieldId}/seasons/${season.id}/update`} />
        </ShowFieldGroup>
      </ShowFieldPage>
      <DataTable
        formId={`${fieldId},${season.id}`}
        columns={jobsTable}
        data={jobs}
        showColumns={{ description: false, id: false }}
      />
    </>
  );
}
