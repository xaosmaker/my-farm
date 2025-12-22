"use client";

import { ColumnDef } from "@tanstack/react-table";
import { FarmFields } from "./types";
import { MapPin } from "lucide-react";

export const fieldsTable: ColumnDef<FarmFields>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "fieldName",
    header: "Field Name",
  },
  {
    accessorKey: "fieldLocation",
    header: "Location",
    cell: ({ row }) => {
      if (row.original.fieldLocation != null) {
        return <MapPin />;
      }

      return null;
    },
  },
];
