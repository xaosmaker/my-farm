"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Field } from "./fieldTypes";
import { DataTable } from "@/components/data-table";
import { useTranslations } from "next-intl";
import AddButtonMenu from "@/components/AddButtonMenu";
import EllipsisMenu from "@/components/EllipsisMenu";
import UpdateItem from "@/components/UpdateItem";
import DeleteItem from "@/components/DeleteItem";
import { deleteFieldAction } from "./fieldActions";
import Link from "next/link";

export default function FieldTable({ fieldData }: { fieldData: Field[] }) {
  const t = useTranslations("Fields.Table");
  const columns: ColumnDef<Field>[] = [
    {
      accessorKey: "id",
      header: t("id"),
      cell: ({ row: { original } }) => (
        <Link href={`/fields/${original.id}`}>{original.id}</Link>
      ),
    },
    {
      accessorKey: "name",
      header: t("name"),
      cell: ({ row: { original } }) => (
        <Link href={`/fields/${original.id}`}>{original.name}</Link>
      ),
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
            <DeleteItem
              formAction={deleteFieldAction}
              label={original.name}
              id={original.id.toString()}
            />
          </>
        </EllipsisMenu>
      ),
    },
  ];
  return <DataTable columns={columns} data={fieldData} />;
}
