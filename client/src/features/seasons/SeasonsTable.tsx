"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { useTranslations } from "next-intl";
import AddButtonMenu from "@/components/AddButtonMenu";
import EllipsisMenu from "@/components/EllipsisMenu";
import UpdateItem from "@/components/UpdateItem";
import DeleteItem from "@/components/DeleteItem";
import { deleteSeasonAction } from "./seasonActions";
import { Season } from "@/types/globalTypes";
import Link from "next/link";

export default function SeasonsTable({
  seasonData,
  fieldId,
}: {
  seasonData: Season[];
  fieldId?: string;
}) {
  const t = useTranslations("Seasons.Table");
  const columns: ColumnDef<Season>[] = [
    {
      accessorKey: "id",
      header: t("id"),
    },
    {
      accessorKey: "name",
      header: t("name"),
    },

    {
      accessorKey: "fieldName",
      header: t("fieldName"),
      cell: ({ row: { original } }) => (
        <Link href={`/fields/${original.id}`}>{original.fieldName}</Link>
      ),
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
      accessorKey: "cropName",
      header: t("cropName"),
    },
    {
      accessorKey: "startSeason",
      header: t("startSeason"),
    },
    {
      accessorKey: "finishSeason",
      header: t("finishSeason"),
    },

    {
      id: "seasonActions",
      header: () => {
        if (fieldId) {
          return (
            <AddButtonMenu
              href={`/fields/${fieldId}/seasons/create`}
              label={t("createSeasonButton")}
            />
          );
        }
        return "...";
      },
      cell: ({ row: { original } }) => (
        <EllipsisMenu label={original.name}>
          <>
            <UpdateItem
              href={`/fields/${original.fieldId}/seasons/${original.id}/update`}
              label={original.name}
            />
            <DeleteItem
              formAction={deleteSeasonAction}
              label={original.name}
              id={original.id.toString()}
              redirectPath="/seasons"
            />
          </>
        </EllipsisMenu>
      ),
    },
  ];
  return <DataTable columns={columns} data={seasonData} />;
}
