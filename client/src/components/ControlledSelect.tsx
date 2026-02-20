import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Field, FieldLabel } from "./ui/field";
export default function ControlledSelect<T extends FieldValues>({
  control,
  ariaLabel,
  name,
  selectItems,
  label,
  placeholder = "",
}: {
  control: Control<T>;
  name: Path<T>;
  ariaLabel: string;
  label?: string;
  selectItems: Array<{ value: string; label: string }>;
  placeholder?: string;
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange } }) => (
        <Field>
          {label && (
            <FieldLabel className="ml-2 text-xs" htmlFor={name}>
              {label}
            </FieldLabel>
          )}
          <Select onValueChange={onChange} value={value}>
            <SelectTrigger
              id={name}
              type="button"
              aria-label={ariaLabel}
              className="w-full"
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {selectItems.map((unit) => (
                <SelectItem key={unit.value} value={unit.value}>
                  {unit.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      )}
    />
  );
}
