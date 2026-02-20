"use client";

import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Plus } from "lucide-react";

export default function AddButtonMenu({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link href={href}>
      <Tooltip>
        <TooltipTrigger className="text-green-500" aria-label={label}>
          <Plus />
        </TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
    </Link>
  );
}
