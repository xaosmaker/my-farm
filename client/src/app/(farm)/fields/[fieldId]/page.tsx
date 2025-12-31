import { DataTable } from "@/components/data-table";
import ShowFieldsData from "@/components/ShowFieldsData";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getFieldById } from "@/features/fields/getters";
import { GetAllJobs } from "@/features/jobs/fetchers";
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
      <div className="relative my-10 grid grid-cols-2 gap-10">
        <Link
          href={`/fields/${fieldId}/jobs/create`}
          className="absolute -top-10 right-0 text-green-500"
        >
          <Tooltip>
            <TooltipTrigger>
              <Plus />
            </TooltipTrigger>
            <TooltipContent>Create field</TooltipContent>
          </Tooltip>
        </Link>
        <ShowFieldsData fieldName="square meters">
          {field.areaInMeters.toString()}
        </ShowFieldsData>
        <ShowFieldsData fieldName="is owned">
          {field.isOwned ? "yes" : "no"}
        </ShowFieldsData>
        <ShowFieldsData fieldName="location">
          {field.fieldLocation.toString()}
        </ShowFieldsData>
        <Link href={"#"}>
          <MapPin />
        </Link>
      </div>
      <DataTable columns={jobsTable} data={jobs} />
    </>
  );
}
