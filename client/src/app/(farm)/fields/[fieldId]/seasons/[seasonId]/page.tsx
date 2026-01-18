import { DataTable } from "@/components/data-table";
import DeleteItem from "@/components/DeleteItem";
import EditItem from "@/components/EditItem";
import ShowFieldGroup from "@/components/ShowFieldGroup";
import ShowFieldPage from "@/components/ShowFieldPage";
import ShowFieldsData from "@/components/ShowFieldsData";
import ShowFieldsDate from "@/components/ShowFieldsDate";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { GetAllJobs } from "@/features/jobs/jobsFetchers";
import { jobsTable } from "@/features/jobs/jobsTable";
import { deleteSeasonAction } from "@/features/seasons/actions/seasonActions";
import { getSeasonById } from "@/features/seasons/fetchers";
import { engToGreek } from "@/lib/translateMap";
import { Plus } from "lucide-react";
import Link from "next/link";

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
        <Link
          href={`/fields/${fieldId}/seasons/${season.id}/jobs/create`}
          className="absolute -top-10 right-0 text-green-500"
        >
          <Tooltip>
            <TooltipTrigger>
              <Plus />
            </TooltipTrigger>
            <TooltipContent>Δημιουργία εργασίας</TooltipContent>
          </Tooltip>
        </Link>
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
        columns={jobsTable}
        data={jobs}
        showColumns={{ description: false, id: false }}
      />
    </>
  );
}
