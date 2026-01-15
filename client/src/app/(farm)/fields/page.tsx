import { DataTable } from "@/components/data-table";
import { fieldsTable } from "@/features/fields/fieldsTable";
import { getAllFields } from "@/features/fields/fieldsFetchers";
import ShowH1 from "@/components/ShowH1";

export default async function FieldsPages() {
  const fields = await getAllFields();

  return (
    <>
      <ShowH1>Χωράφια</ShowH1>
      <DataTable
        columns={fieldsTable}
        data={fields}
        showColumns={{
          landUnit: false,
          fieldLocation: false,
          mapLocation: false,
        }}
      />
    </>
  );
}
