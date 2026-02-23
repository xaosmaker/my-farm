"use client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { useTranslations } from "next-intl";
import AddButtonMenu from "@/components/AddButtonMenu";
import EllipsisMenu from "@/components/EllipsisMenu";
import UpdateItem from "@/components/UpdateItem";
import DeleteItem from "@/components/DeleteItem";
import { deleteSupplyAction } from "./suppliesActions";
import { Supply } from "@/types/globalTypes";

export default function SuppliesTable({
  supplyData,
}: {
  supplyData: Supply[];
}) {
  const t = useTranslations("Supplies.Table");
  const columns: ColumnDef<Supply>[] = [
    {
      accessorKey: "id",
      header: t("id"),
    },
    {
      accessorKey: "name",
      header: t("name"),
    },
    {
      accessorKey: "nickname",
      header: t("nickname"),
    },
    {
      accessorKey: "supplyType",
      header: t("supplyType"),
    },
    {
      accessorKey: "measurementUnit",
      header: t("measurementUnit"),
    },
    {
      id: "supplyActions",
      header: () => {
        return (
          <AddButtonMenu
            href="/supplies/create"
            label={t("createSupplyButton")}
          />
        );
      },
      cell: ({ row: { original } }) => (
        <EllipsisMenu label={original.name}>
          <>
            <UpdateItem
              href={`/supplies/${original.id}/update`}
              label={original.name}
            />
            <DeleteItem
              formAction={deleteSupplyAction}
              label={original.name}
              id={original.id.toString()}
              redirectPath="/supplies"
            />
          </>
        </EllipsisMenu>
      ),
    },
  ];
  return <DataTable columns={columns} data={supplyData} />;
}
