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
  required,
}: {
  control: Control<T>;
  name: Path<T>;
  ariaLabel: string;
  label?: string;
  selectItems: Array<{ value: string; label: string }>;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange }, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          {label && (
            <FieldLabel className="ml-2 text-xs" htmlFor={name}>
              {label} {required && <span className="text-red-500">*</span>}
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
