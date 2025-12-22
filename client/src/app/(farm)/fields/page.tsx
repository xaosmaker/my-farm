import { DataTable } from "@/components/data-table";
import { fieldsTable } from "@/features/fields/fieldsTable";
import { getAllFields } from "@/features/fields/getters";

export default async function FieldsPages() {
  const fields = await getAllFields();
  console.log(fields);

  return <DataTable columns={fieldsTable} data={fields} />;
}
