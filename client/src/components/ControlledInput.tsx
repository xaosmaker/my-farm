import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { InputHTMLAttributes } from "react";

export default function ControlledInput<T extends FieldValues>({
  control,
  name,
  label,
  type = "text",
}: {
  control: Control<T>;
  name: Path<T>;
  label: string;
  type?: InputHTMLAttributes<HTMLInputElement>["type"];
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ fieldState, field }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={name}>{label}</FieldLabel>
          <Input
            {...field}
            aria-invalid={fieldState.invalid}
            id={name}
            type={type}
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
