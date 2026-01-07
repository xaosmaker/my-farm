import { EllipsisVertical } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";

export default function ActionMenu({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Popover>
      <PopoverTrigger>
        <EllipsisVertical />
      </PopoverTrigger>
      <PopoverContent sideOffset={10} className="flex w-fit flex-col gap-2">
        {children}
      </PopoverContent>
    </Popover>
  );
}
