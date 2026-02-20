"use client";

import { EllipsisVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { useTranslations } from "next-intl";

export default function EllipsisMenu({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const t = useTranslations("ActionMenu");
  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild className="cursor-pointer">
          <DropdownMenuTrigger aria-label={t("action", { name: label })}>
            <EllipsisVertical />
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>{t("action", { name: label })}</TooltipContent>
      </Tooltip>
      <DropdownMenuContent>{children}</DropdownMenuContent>
    </DropdownMenu>
  );
}
