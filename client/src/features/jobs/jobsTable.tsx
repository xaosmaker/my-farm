"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Job } from "./types";

export const jobsTable: ColumnDef<Job>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },

  {
    accessorKey: "jobType",
    header: "Job Type",
  },

  { accessorKey: "jobDate", header: "Job Date" },
  {
    accessorKey: "description",
    header: "Job Description",
    cell: ({ row }) => {
      const split_description = row.original.description?.split(" ") || [];

      if (split_description?.length > 5) {
        return split_description?.slice(0, 5).join(" ") + " ...";
      }
      return row.original.description;
    },
  },
  {
    id: "jobActions",
    header: () => "Actions",
  },
];
