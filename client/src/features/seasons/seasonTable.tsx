"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { engToGreek } from "@/lib/translateMap";
import { Season } from "@/types/sharedTypes";
import ActionMenu from "@/components/ActionMenu";
import DeleteItem from "@/components/DeleteItem";
import { deleteSeasonAction } from "./actions/seasonActions";
import EditItem from "@/components/EditItem";
import LocalDate from "@/components/LocalDate";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Plus } from "lucide-react";

export const seasonsTable: ColumnDef<Season>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      return (
        <Link
          href={`/fields/${row.original.fieldId}/seasons/${row.original.id}`}
        >
          {row.original.id}
        </Link>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Όνομα",

    cell: ({ row }) => {
      return (
        <Link
          href={`/fields/${row.original.fieldId}/seasons/${row.original.id}`}
        >
          {row.original.name}
        </Link>
      );
    },
  },
  {
    accessorKey: "fieldName",
    header: "Όνομα χωραφιου",
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
    cell: ({ row }) => <LocalDate date={row.original.startSeason} />,
  },
  {
    accessorKey: "finishSeason",
    header: "Λήξη σεζόν",
    cell: ({ row: { original } }) => {
      if (original.finishSeason) {
        return <LocalDate date={original.finishSeason} />;
      }
    },
  },
  {
    id: "createSeason",
    header: ({ table }) => {
      console.log(table.options.meta?.formId);
      if (table.options.meta?.formId) {
        return (
          <Link
            href={`/fields/${table.options.meta.formId}/seasons/create`}
            className="text-green-500"
          >
            <Tooltip>
              <TooltipTrigger>
                <Plus />
              </TooltipTrigger>
              <TooltipContent>Δημιουργία σεζόν</TooltipContent>
            </Tooltip>
          </Link>
        );
      }
    },
    cell: ({
      row: {
        original: { name, id, fieldId },
      },
    }) => {
      return (
        <ActionMenu>
          <DeleteItem
            id={id.toString()}
            name={name}
            formAction={deleteSeasonAction}
          />
          <EditItem url={`/fields/${fieldId}/seasons/${id}/update`} />
        </ActionMenu>
      );
    },
  },
];
