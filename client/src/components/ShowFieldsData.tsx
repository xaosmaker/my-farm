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
    <div className="relative">
      <Label className="bg-background absolute top-0 left-2 -translate-y-1/2 px-1 text-xs">
        {fieldName}
      </Label>
      <Input
        className="caret-transparent focus-visible:border-inherit focus-visible:ring-transparent"
        readOnly={true}
        value={children}
      />
    </div>
  );
}
