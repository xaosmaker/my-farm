import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Field, FieldError } from "./ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export default function ControlledSelect<T extends FieldValues>({
  control,
  name,
  placeholder,
  values,
}: {
  control: Control<T>;
  name: Path<T>;
  placeholder: string;
  values: { value: string; label: string }[];
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ fieldState, field }) => (
        <Field data-invalid={fieldState.invalid}>
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {values.map((item) => (
                <SelectItem key={item.value + item.label} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
