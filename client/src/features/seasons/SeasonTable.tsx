"use client";

import { ColumnDef, VisibilityState } from "@tanstack/react-table";
import Link from "next/link";
import { Season } from "@/types/sharedTypes";
import ActionMenu from "@/components/ActionMenu";
import DeleteItem from "@/components/DeleteItem";
import { deleteSeasonAction } from "./actions/seasonActions";
import EditItem from "@/components/EditItem";
import LocalDate from "@/components/LocalDate";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { useTranslations } from "next-intl";
export default function SeasonTable({
  fieldId,
  seasonsData,
  showColumns,
}: {
  fieldId?: string;
  seasonsData: Season[];
  showColumns?: VisibilityState;
}) {
  const t = useTranslations("Seasons.Table");
  const seasonColumns: ColumnDef<Season>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => {
        return (
          <Link
            href={`/fields/${row.original.fieldId}/seasons/${row.original.id}`}
            className="py-2"
          >
            {row.original.id}
          </Link>
        );
      },
    },
    {
      accessorKey: "name",
      header: t("name"),

      cell: ({ row }) => {
        return (
          <Link
            className="py-2"
            href={`/fields/${row.original.fieldId}/seasons/${row.original.id}`}
          >
            {row.original.name}
          </Link>
        );
      },
    },
    {
      accessorKey: "fieldName",
      header: t("fieldName"),
      cell: ({ row }) => {
        return (
          <Link className="py-2" href={`/fields/${row.original.fieldId}`}>
            {row.original.fieldName}
          </Link>
        );
      },
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
      cell: ({ row }) => {
        return (
          <Link className="py-2" href={`/supplies/${row.original.crop}`}>
            {row.original.cropName}
          </Link>
        );
      },
    },
    {
      accessorKey: "startSeason",
      header: t("startSeason"),
      cell: ({ row }) => {
        return <LocalDate date={row.original.startSeason} />;
      },
    },
    {
      accessorKey: "finishSeason",
      header: t("finishSeason"),
      cell: ({ row: { original } }) => {
        if (original.finishSeason) {
          return <LocalDate date={original.finishSeason} />;
        }
      },
    },
    {
      id: "createSeason",
      header: ({ table }) => {
        if (table.options.meta?.formId) {
          return (
            <Link
              href={`/fields/${table.options.meta.formId}/seasons/create`}
              className="text-green-500"
            >
              <Tooltip>
                <TooltipTrigger>
                  <Plus />
                </TooltipTrigger>
                <TooltipContent>Δημιουργία σεζόν</TooltipContent>
              </Tooltip>
            </Link>
          );
        }
      },
      cell: ({
        row: {
          original: { name, id, fieldId },
        },
      }) => {
        return (
          <ActionMenu>
            <DeleteItem
              id={id.toString()}
              name={name}
              formAction={deleteSeasonAction}
            />
            <EditItem url={`/fields/${fieldId}/seasons/${id}/update`} />
          </ActionMenu>
        );
      },
    },
  ];
  return (
    <DataTable
      formId={fieldId}
      columns={seasonColumns}
      data={seasonsData}
      translation="Seasons.Table"
      showColumns={
        showColumns
          ? showColumns
          : {
              landUnit: false,
              areaInMeters: false,
              fieldName: false,
            }
      }
    />
  );
}
