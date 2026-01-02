"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Job } from "./types";
import { engToGreek } from "@/lib/translateMap";

export const jobsTable: ColumnDef<Job>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },

  {
    accessorKey: "jobType",
    header: "Κατηγορία",
    cell: ({
      row: {
        original: { jobType },
      },
    }) => engToGreek.get(jobType) || jobType,
  },

  { accessorKey: "jobDate", header: "Ημερομηνία" },

  {
    accessorKey: "description",
    header: "Περίληψη",
    cell: ({ row }) => {
      const split_description = row.original.description?.split(" ") || [];

      if (split_description?.length > 5) {
        return split_description?.slice(0, 5).join(" ") + " ...";
      }
      return row.original.description;
    },
  },
  {
    accessorKey: "totalSupplies",
    header: "Χρησιμοποιήθηκαν εφόδια",
  },
  {
    id: "jobActions",
  },
];
