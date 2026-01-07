"use client";

import ActionMenu from "@/components/ActionMenu";
import DeleteItem from "@/components/DeleteItem";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { engToGreek } from "@/lib/translateMap";
import { Supply } from "@/types/sharedTypes";
import { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import Link from "next/link";
import { deleteSupplyAction } from "./actions/createSuppliesActions";
export const suppliesTable: ColumnDef<Supply>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      return (
        <Link href={`/supplies/${row.original.id}`}>{row.original.id}</Link>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Όνομα φάρμακου",

    cell: ({ row }) => {
      return (
        <Link href={`/supplies/${row.original.id}`}>{row.original.name}</Link>
      );
    },
  },

  {
    accessorKey: "nickname",
    header: "Ψευδώνυμο",

    cell: ({ row }) => {
      return (
        <Link href={`/supplies/${row.original.id}`}>
          {row.original.nickname}
        </Link>
      );
    },
  },
  {
    accessorKey: "supplyType",
    header: "Κατηγορία",
    cell: ({ row }) =>
      engToGreek.get(row.original.supplyType) || row.original.supplyType,
  },
  {
    accessorKey: "measurementUnit",
    header: "Μονάδα Μέτρησης",
    cell: ({
      row: {
        original: { measurementUnit },
      },
    }) => engToGreek.get(measurementUnit) || measurementUnit,
  },
  {
    id: "Supllies Actions",
    header: () => (
      <Link href="/supplies/create" className="text-green-500">
        <Tooltip>
          <TooltipTrigger>
            <Plus />
          </TooltipTrigger>
          <TooltipContent>Δημιουργία εφοδίων</TooltipContent>
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
      </ActionMenu>
    ),
  },
];
