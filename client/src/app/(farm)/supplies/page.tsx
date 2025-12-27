import { DataTable } from "@/components/data-table";
import { getAllSupplies } from "@/features/supplies/getters";
import { suppliesTable } from "@/features/supplies/suppliesTable";

export default async function SuppliesPage() {
  const supplies = await getAllSupplies();
  console.log(supplies);

  return <DataTable data={supplies} columns={suppliesTable} />;
}
