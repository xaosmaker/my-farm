"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Supply } from "@/types/sharedTypes";
import { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import Link from "next/link";
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
    header: "Field Name",

    cell: ({ row }) => {
      return (
        <Link href={`/supplies/${row.original.id}`}>{row.original.name}</Link>
      );
    },
  },

  {
    accessorKey: "nickname",
    header: "Alias",

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
    header: "Supply Type",
  },
  { accessorKey: "measurementUnit", header: "Unit" },
  {
    id: "Supllies Actions",
    header: () => (
      <Link href="/supplies/create" className="text-green-500">
        <Tooltip>
          <TooltipTrigger>
            <Plus />
          </TooltipTrigger>
          <TooltipContent>Create Supply</TooltipContent>
        </Tooltip>
      </Link>
    ),
  },
];
