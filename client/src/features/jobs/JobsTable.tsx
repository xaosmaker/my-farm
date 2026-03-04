"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { useTranslations } from "next-intl";
import { Job } from "./types";
import DeleteItem from "@/components/DeleteItem";
import { deleteJobAction } from "./jobsActions";
import { roundTo6 } from "@/lib/utils";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import AddButtonMenu from "@/components/AddButtonMenu";
import EllipsisMenu from "@/components/EllipsisMenu";

interface JobsTableProps {
  jobs: Job[];
  seasonId: number;
}

export default function JobsTable({ jobs, seasonId }: JobsTableProps) {
  const t = useTranslations("Jobs.Table");

  const columns: ColumnDef<Job>[] = [
    {
      accessorKey: "id",
      header: t("id"),
    },
    {
      accessorKey: "jobType",
      header: t("jobType"),
    },
    {
      accessorKey: "jobDate",
      header: t("jobDate"),
    },
    {
      accessorKey: "description",
      header: t("description"),
      cell: ({ row }) => {
        const desc = row.original.description;
        if (!desc) return "-";
        const words = desc.split(" ");
        if (words.length > 5) {
          return words.slice(0, 5).join(" ") + " ...";
        }
        return desc;
      },
    },
    {
      accessorKey: "jobsSupplies",
      header: t("supplies"),
      cell: ({ row }) => {
        const supplies = row.original.jobsSupplies;
        if (supplies.length === 0) return "-";

        return (
          <Accordion type="single" collapsible>
            <AccordionItem value={row.original.id.toString()}>
              <AccordionTrigger className="text-center">
                {supplies.length}
              </AccordionTrigger>
              <AccordionContent>
                {supplies.map((supply) => (
                  <div key={supply.id} className="text-xs">
                    <span>{supply.supplyName}: </span>
                    <span>
                      {roundTo6(
                        supply.quantity / row.original.areaInMeters,
                      )}{" "}
                    </span>
                    <span>{supply.supplyMeasurementUnit}</span>
                    <span>/{row.original.landUnit}</span>
                    <br />
                    <span>Total: </span>
                    <span>{roundTo6(supply.quantity)} </span>
                    <span>{supply.supplyMeasurementUnit}</span>
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
      header: () => (
        <AddButtonMenu
          href={`/seasons/${seasonId}/jobs/create`}
          label={t("createJobButton")}
        />
      ),
      cell: ({ row }) => (
        <EllipsisMenu label={row.original.jobType}>
          <DeleteItem
            id={row.original.id.toString()}
            label={row.original.jobType}
            formAction={deleteJobAction}
            redirectPath={`/seasons/${seasonId}`}
          />
        </EllipsisMenu>
      ),
    },
  ];

  return <DataTable columns={columns} data={jobs} />;
}
