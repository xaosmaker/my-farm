import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface DetailRowProps {
  label: string;
  value: React.ReactNode;
  icon?: LucideIcon;
  className?: string;
}

export function DetailRow({ label, value, icon: Icon, className }: DetailRowProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between border-b pb-3 last:border-0 last:pb-0",
        className
      )}
    >
      <span className="text-muted-foreground flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4" />}
        {label}
      </span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}
