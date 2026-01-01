import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function ShowFieldsData({
  fieldName = "name",
  children,
}: {
  fieldName?: string;
  children: Readonly<string>;
}) {
  return (
    <div className="relative mt-2 first:mt-6">
      <Label className="bg-background absolute top-0 left-2 -translate-y-1/2 rounded-xl border-2 px-4 py-0.5 text-xs">
        {fieldName}
      </Label>
      <Input
        className="py-4 pt-6 caret-transparent focus-visible:border-inherit focus-visible:ring-transparent"
        readOnly={true}
        value={children}
      />
    </div>
  );
}
