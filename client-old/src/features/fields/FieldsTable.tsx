"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MapPin, Plus } from "lucide-react";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ActionMenu from "@/components/ActionMenu";
import DeleteItem from "@/components/DeleteItem";
import { deleteFieldAction } from "./actions/actions";
import EditItem from "@/components/EditItem";
import { Field } from "@/types/sharedTypes";
import { DataTable } from "@/components/data-table";
import { useTranslations } from "next-intl";

export function FieldsTable({ fieldsData }: { fieldsData: Field[] }) {
  const t = useTranslations("Fields.Table");
  const fieldsColumns: ColumnDef<Field>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => {
        return (
          <Link href={`/fields/${row.original.id}`} className="py-2">
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
          <Link href={`/fields/${row.original.id}`} className="py-2">
            {row.original.name}
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
    { accessorKey: "fieldLocation", header: t("fieldLocation") },
    {
      accessorKey: "mapLocation",
      header: t("mapLocation"),
      cell: () => {
        return (
          <Tooltip>
            <TooltipTrigger>
              <MapPin />
            </TooltipTrigger>
            <TooltipContent>{t("comingSoon")}</TooltipContent>
          </Tooltip>
        );
      },
    },
    {
      id: "createField",
      header: () => (
        <Link href="/fields/create" className="text-green-500">
          <Tooltip>
            <TooltipTrigger>
              <Plus />
            </TooltipTrigger>
            <TooltipContent>{t("createFieldButton")}</TooltipContent>
          </Tooltip>
        </Link>
      ),
      cell: ({ row }) => (
        <ActionMenu>
          <DeleteItem
            id={row.original.id.toString()}
            name={row.original.name}
            formAction={deleteFieldAction}
          />
          <EditItem url={`/fields/${row.original.id}/edit`} />
        </ActionMenu>
      ),
    },
  ];
  return (
    <DataTable
      columns={fieldsColumns}
      data={fieldsData}
      translation="Fields.Table"
      showColumns={{
        landUnit: false,
        fieldLocation: false,
        mapLocation: false,
      }}
    />
  );
}
