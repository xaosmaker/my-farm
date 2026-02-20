"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Field } from "./fieldTypes";
import { DataTable } from "@/components/data-table";
import { Messages, useTranslations } from "next-intl";
import AddButtonMenu from "@/components/AddButtonMenu";
import EllipsisMenu from "@/components/EllipsisMenu";
import UpdateItem from "@/components/UpdateItem";

export default function FieldTable({ fieldData }: { fieldData: Field[] }) {
  const t = useTranslations("Fields.Table");
  const columns: ColumnDef<Field>[] = [
    {
      accessorKey: "id",
      header: t("id"),
    },
    {
      accessorKey: "name",
      header: t("name"),
    },
    {
      accessorKey: "fieldLocation",
      header: t("fieldLocation"),
    },
    {
      accessorKey: "areaInMeters",
      header: t("areaInMeters"),
    },

    {
      accessorKey: "landUnit",
      header: t("landUnit"),
    },
    {
      accessorKey: "isOwned",
      header: t("isOwned"),
    },
    {
      id: "fieldActions",
      header: () => {
        return (
          <AddButtonMenu href="/fields/create" label={t("createFieldButton")} />
        );
      },
      cell: ({ row: { original } }) => (
        <EllipsisMenu label={original.name}>
          <>
            <UpdateItem
              href={`/fields/${original.id}/update`}
              label={original.name}
            />
          </>
        </EllipsisMenu>
      ),
    },
  ];
  return <DataTable columns={columns} data={fieldData} />;
}
