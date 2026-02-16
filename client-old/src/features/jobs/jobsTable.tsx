"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Job } from "./types";
import { engToGreek } from "@/lib/translateMap";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import LocalDate from "@/components/LocalDate";
import { roundTo6 } from "@/lib/utils";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Plus } from "lucide-react";
import ActionMenu from "@/components/ActionMenu";
import DeleteItem from "@/components/DeleteItem";
import { deleteJobAction } from "./actions/createJobAction";

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

  {
    accessorKey: "jobDate",
    header: "Ημερομηνία",
    cell: ({ row }) => <LocalDate date={row.original.jobDate} />,
  },

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
    id: "totalSupplies",
    header: "Χρησιμοποιήθηκαν εφόδια",
    cell: ({ row: { original } }) => {
      return (
        <Accordion type="single" collapsible>
          <AccordionItem value={original.id.toString()}>
            <AccordionTrigger className="text-center">
              {original.jobsSupplies.length || ""}
            </AccordionTrigger>
            <AccordionContent>
              {original.jobsSupplies.map((item) => (
                <div key={item.supplyName + item.id.toString()}>
                  <span> {item.supplyName}: </span>
                  <span>
                    {roundTo6(item.quantity / original.areaInMeters)}{" "}
                  </span>
                  <span>
                    {engToGreek.get(item.supplyMeasurementUnit) ||
                      item.supplyMeasurementUnit}
                  </span>
                  <span>
                    /{engToGreek.get(original.landUnit) || original.landUnit}
                  </span>
                  <br />
                  <span> Σύνολο: </span>
                  <span>{roundTo6(item.quantity)} </span>
                  <span>
                    {engToGreek.get(item.supplyMeasurementUnit) ||
                      item.supplyMeasurementUnit}
                  </span>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      );
    },
  },
  {
    id: "jobActions",
    header: ({ table: { options } }) => {
      if (options.meta?.formId) {
        const data = options.meta.formId.split(",");
        if (data.length != 2) {
          throw new Error("form id want 2 values and get more");
        }
        const [fieldId, seasonId] = data;

        return (
          <Link
            href={`/fields/${fieldId}/seasons/${seasonId}/jobs/create`}
            className="text-green-500"
          >
            <Tooltip>
              <TooltipTrigger>
                <Plus />
              </TooltipTrigger>
              <TooltipContent>Δημιουργία εργασίας</TooltipContent>
            </Tooltip>
          </Link>
        );
      }
    },
    cell: ({ row: { original } }) => {
      return (
        <ActionMenu>
          <DeleteItem
            id={original.id.toString()}
            name={engToGreek.get(original.jobType) || original.jobType}
            formAction={deleteJobAction}
          />
        </ActionMenu>
      );
    },
  },
];
