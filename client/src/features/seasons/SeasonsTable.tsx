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

export default function SeasonsTable({ seasonData }: { seasonData: Season[] }) {
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
    },
    {
      accessorKey: "areaInMeters",
      header: t("areaInMeters"),
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
      accessorKey: "landUnit",
      header: t("landUnit"),
    },

    {
      id: "seasonActions",
      header: () => {
        return (
          <AddButtonMenu
            href="/seasons/create"
            label={t("createSeasonButton")}
          />
        );
      },
      cell: ({ row: { original } }) => (
        <EllipsisMenu label={original.name}>
          <>
            <UpdateItem
              href={`/seasons/${original.id}/update`}
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
