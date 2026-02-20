import { ColumnDef } from "@tanstack/react-table";
import { Field } from "./fieldTypes";
import { DataTable } from "@/components/data-table";
import { useTranslations } from "next-intl";

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
  ];
  return <DataTable columns={columns} data={fieldData} />;
}
