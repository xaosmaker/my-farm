import { DataTable } from "@/components/data-table";
import DeleteItem from "@/components/DeleteItem";
import EditItem from "@/components/EditItem";
import ShowFieldGroup from "@/components/ShowFieldGroup";
import ShowFieldPage from "@/components/ShowFieldPage";
import ShowFieldsData from "@/components/ShowFieldsData";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { deleteFieldAction } from "@/features/fields/actions/actions";
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
      <ShowFieldPage title={field.name}>
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
          <ShowFieldsData fieldName="Τ.Μ τετραγωνικά μέτρα">
            {field.areaInMeters.toString()}
          </ShowFieldsData>
          <ShowFieldsData fieldName="Ιδιόκτητο">
            {field.isOwned ? "ναι" : "όχι"}
          </ShowFieldsData>
        </ShowFieldGroup>
        <ShowFieldGroup groupName="Τοποθεσία">
          <ShowFieldsData fieldName="Τοποθεσία">
            {field.fieldLocation.toString()}
          </ShowFieldsData>
          <Link href={"#"}>
            <MapPin />
          </Link>
        </ShowFieldGroup>
        <ShowFieldGroup groupName="Actions" className="col-span-2 mt-10 gap-1">
          <DeleteItem
            name={field.name}
            formAction={deleteFieldAction}
            id={field.id.toString()}
          />

          <EditItem url={`/fields/${field.id}/edit`} />
        </ShowFieldGroup>
      </ShowFieldPage>
      <DataTable columns={jobsTable} data={jobs} />
    </>
  );
}
