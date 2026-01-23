"use client";

import ActionMenu from "@/components/ActionMenu";
import DeleteItem from "@/components/DeleteItem";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Supply } from "@/types/sharedTypes";
import { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import Link from "next/link";
import { deleteSupplyAction } from "./actions/createSuppliesActions";
import EditItem from "@/components/EditItem";
import { DataTable } from "@/components/data-table";
import { useTranslations } from "next-intl";
export default function SuppliesTable({
  suppliesData,
}: {
  suppliesData: Supply[];
}) {
  const t = useTranslations("Supplies.Table");
  const suppliesTable: ColumnDef<Supply>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => {
        return (
          <Link href={`/supplies/${row.original.id}`} className="py-2">
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
          <Link href={`/supplies/${row.original.id}`} className="py-2">
            {row.original.name}
          </Link>
        );
      },
    },

    {
      accessorKey: "nickname",
      header: t("nickname"),

      cell: ({ row }) => {
        return (
          <Link href={`/supplies/${row.original.id}`} className="py-2">
            {row.original.nickname}
          </Link>
        );
      },
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
      id: "suppliesAction",
      header: () => (
        <Link href="/supplies/create" className="text-green-500">
          <Tooltip>
            <TooltipTrigger>
              <Plus />
            </TooltipTrigger>
            <TooltipContent>{t("createSupplyButton")}</TooltipContent>
          </Tooltip>
        </Link>
      ),
      cell: ({
        row: {
          original: { name, id },
        },
      }) => (
        <ActionMenu>
          <DeleteItem
            id={id.toString()}
            name={name}
            formAction={deleteSupplyAction}
          />
          <EditItem url={`/supplies/${id}/update`} />
        </ActionMenu>
      ),
    },
  ];

  return (
    <DataTable
      data={suppliesData}
      translation="Supplies.Table"
      columns={suppliesTable}
      showColumns={{ nickname: false, measurementUnit: false }}
    />
  );
}
