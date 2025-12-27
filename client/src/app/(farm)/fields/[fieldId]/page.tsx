import ShowFieldsData from "@/components/ShowFieldsData";
import { getFieldById } from "@/features/fields/getters";
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

  return (
    <div className="grid grid-cols-2 gap-10">
      <h1 className="col-span-2 text-center text-2xl">{field.name}</h1>

      <ShowFieldsData>{field.areaInMeters.toString()}</ShowFieldsData>
      <ShowFieldsData>{field.isOwned ? "true" : "false"}</ShowFieldsData>
      <ShowFieldsData>{field.fieldLocation.toString()}</ShowFieldsData>
      <Link href={"#"}>
        <MapPin />
      </Link>
    </div>
  );
}
