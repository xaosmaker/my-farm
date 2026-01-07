"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Field } from "./types";
import { MapPin, Pencil, Plus } from "lucide-react";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ActionMenu from "@/components/ActionMenu";
import DeleteItem from "@/components/DeleteItem";
import { deleteFieldAction } from "./actions/actions";

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
    header: "Χωράφια",

    cell: ({ row }) => {
      return (
        <Link href={`/fields/${row.original.id}`}>{row.original.name}</Link>
      );
    },
  },
  {
    accessorKey: "mapLocation",
    header: "Χάρτης",
    cell: () => {
      return (
        <Tooltip>
          <TooltipTrigger>
            <MapPin />
          </TooltipTrigger>
          <TooltipContent>σύντομα κοντά σας</TooltipContent>
        </Tooltip>
      );
    },
  },
  { accessorKey: "fieldLocation", header: "Τοποθεσία" },
  {
    id: "createField",
    header: () => (
      <Link href="/fields/create" className="text-green-500">
        <Tooltip>
          <TooltipTrigger>
            <Plus />
          </TooltipTrigger>
          <TooltipContent>Δημιουργία Χωραφιού</TooltipContent>
        </Tooltip>
      </Link>
    ),
    cell: ({ row }) => (
      <ActionMenu>
        <DeleteItem
          id={row.original.id.toString()}
          name={row.original.name}
          formAction={deleteFieldAction}
        />
        <Link href={`fields/${row.original.id}/edit`} className="flex gap-2">
          <Pencil /> Edit
        </Link>
      </ActionMenu>
    ),
  },
];
