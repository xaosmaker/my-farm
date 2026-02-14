import { cn } from "@/lib/utils";

export default function H1({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: HTMLDivElement["className"];
}) {
  return <h1 className={cn("text-4xl font-bold", className)}>{children}</h1>;
}
