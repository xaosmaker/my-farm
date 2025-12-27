"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Supply } from "./types";

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
];
