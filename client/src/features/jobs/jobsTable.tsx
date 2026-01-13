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
                  <span>Ποσότητα: </span>
                  <span>{item.quantity} </span>
                  <span>
                    {engToGreek.get(item.supplyMeasurementUnit) ||
                      item.supplyMeasurementUnit}
                  </span>
                  <span> {item.supplyName}</span>
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
  },
];
