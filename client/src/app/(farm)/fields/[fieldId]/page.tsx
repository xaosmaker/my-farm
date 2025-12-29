import { DataTable } from "@/components/data-table";
import ShowFieldsData from "@/components/ShowFieldsData";
import { getFieldById } from "@/features/fields/getters";
import { GetAllJobs } from "@/features/jobs/fetchers";
import { jobsTable } from "@/features/jobs/jobsTable";
import { MapPin } from "lucide-react";
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
  console.log(jobs);

  return (
    <>
      <h1 className="text-center text-2xl">{field.name}</h1>
      <div className="my-10 grid grid-cols-2 gap-10">
        <ShowFieldsData>{field.areaInMeters.toString()}</ShowFieldsData>
        <ShowFieldsData>{field.isOwned ? "true" : "false"}</ShowFieldsData>
        <ShowFieldsData>{field.fieldLocation.toString()}</ShowFieldsData>
        <Link href={"#"}>
          <MapPin />
        </Link>
      </div>
      <DataTable columns={jobsTable} data={jobs} />
    </>
  );
}
