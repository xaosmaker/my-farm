"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { engToGreek } from "@/lib/translateMap";
import { Season } from "./types/seasonTypes";

export const seasonsTable: ColumnDef<Season>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      return <Link href={`/fields/${row.original.id}`}>{row.original.id}</Link>;
    },
  },
  {
    accessorKey: "name",
    header: "Όνομα",

    cell: ({ row }) => {
      return (
        <Link href={`/seasons/${row.original.id}`}>{row.original.name}</Link>
      );
    },
  },
  {
    accessorKey: "areaInMeters",
    header: "Εκταση",
  },
  {
    accessorKey: "landUnit",
    header: "Μοναδα",
    cell: ({ row }) => {
      return engToGreek.get(row.original.landUnit);
    },
  },
  { accessorKey: "cropName", header: "Καλλιέργεια" },
  {
    accessorKey: "startSeason",
    header: "Έναρξη σεζόν",
  },
  { accessorKey: "finishSeason", header: "Λήξη σεζόν" },
  {
    id: "createSeason",
    header: "",
  },
];
