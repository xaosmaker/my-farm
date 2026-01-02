import { DataTable } from "@/components/data-table";
import ShowFieldGroup from "@/components/ShowFieldGroup";
import ShowFieldsData from "@/components/ShowFieldsData";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getFieldById } from "@/features/fields/fieldsFetchers";
import { GetAllJobs } from "@/features/jobs/jobsFetchers";
import { jobsTable } from "@/features/jobs/jobsTable";
import { MapPin, Plus } from "lucide-react";
import Link from "next/link";

export default async function FieldPage({
  params,
}: {
  params: Promise<{ fieldId: string }>;
}) {
  const { fieldId } = await params;
  const fields = await getFieldById(fieldId);
  if (fields.length != 1) {
    return <div>No Field Found</div>;
  }
  const field = fields[0];
  const jobs = await GetAllJobs(fieldId);

  return (
    <>
      <h1 className="text-center text-2xl">{field.name}</h1>
      <div className="relative my-10 grid grid-cols-2 gap-2">
        <Link
          href={`/fields/${fieldId}/jobs/create`}
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
          <>
            <ShowFieldsData fieldName="Τ.Μ τετραγωνικά μέτρα">
              {field.areaInMeters.toString()}
            </ShowFieldsData>
            <ShowFieldsData fieldName="Ιδιόκτητο">
              {field.isOwned ? "ναι" : "όχι"}
            </ShowFieldsData>
          </>
        </ShowFieldGroup>
        <>
          <ShowFieldGroup groupName="Τοποθεσία">
            <ShowFieldsData fieldName="Τοποθεσία">
              {field.fieldLocation.toString()}
            </ShowFieldsData>
            <Link href={"#"}>
              <MapPin />
            </Link>
          </ShowFieldGroup>
        </>
      </div>
      <DataTable columns={jobsTable} data={jobs} />
    </>
  );
}
