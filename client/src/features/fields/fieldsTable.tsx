"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Field } from "./types";
import { MapPin, Plus } from "lucide-react";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const fieldsTable: ColumnDef<Field>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      return <Link href={`/fields/${row.original.id}`}>{row.original.id}</Link>;
    },
  },
  {
    accessorKey: "name",
    header: "Field Name",

    cell: ({ row }) => {
      return (
        <Link href={`/fields/${row.original.id}`}>{row.original.name}</Link>
      );
    },
  },
  {
    accessorKey: "mapLocation",
    header: "Map Location",
    cell: ({ row }) => {
      if (row.original.mapLocation != null) {
        return <MapPin />;
      }

      return null;
    },
  },
  { accessorKey: "fieldLocation", header: "Location" },
  {
    id: "createField",
    header: () => (
      <Link href="/fields/create" className="text-green-500">
        <Tooltip>
          <TooltipTrigger>
            <Plus />
          </TooltipTrigger>
          <TooltipContent>Create Field</TooltipContent>
        </Tooltip>
      </Link>
    ),
  },
];
