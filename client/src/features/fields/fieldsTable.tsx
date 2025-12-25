"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Field } from "./types";
import { MapPin } from "lucide-react";

export const fieldsTable: ColumnDef<Field>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Field Name",
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
];
