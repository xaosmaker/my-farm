import { DataTable } from "@/components/data-table";
import ShowH1 from "@/components/ShowH1";
import { getAllSupplies } from "@/features/supplies/getters";
import { suppliesTable } from "@/features/supplies/suppliesTable";

export default async function SuppliesPage() {
  const supplies = await getAllSupplies();

  return (
    <>
      <ShowH1>Εφόδια</ShowH1>
      <DataTable data={supplies} columns={suppliesTable} />
    </>
  );
}
