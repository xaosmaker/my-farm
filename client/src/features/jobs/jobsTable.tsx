"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Job } from "./types";

export const jobsTable: ColumnDef<Job>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "description",
    header: "Job Description",
  },
  {
    accessorKey: "jobType",
    header: "Job Type",
  },
  { accessorKey: "jobDate", header: "Job Date" },
];
