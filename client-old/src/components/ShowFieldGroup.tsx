import { cn } from "@/lib/utils";

export default function ShowFieldGroup({
  children,
  groupName,
  className,
}: {
  children: React.ReactNode;
  groupName: string;
  className?: HTMLDivElement["className"];
}) {
  return (
    <div
      className={cn(
        "relative flex flex-col gap-4 rounded-xl border-2 p-2",
        className,
      )}
    >
      {children}

      <p className="bg-background absolute top-0 left-1/2 -translate-1/2 rounded-xl border-2 px-4">
        {groupName}
      </p>
    </div>
  );
}
