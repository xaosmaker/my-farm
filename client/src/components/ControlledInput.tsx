import type { Control, FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputHTMLAttributes } from "react";

export default function ControlledInput<T extends FieldValues>({
  name,
  label,
  control,
  type,
  required,
}: {
  name: Path<T>;
  label: string;
  control: Control<T>;
  type?: InputHTMLAttributes<HTMLInputElement>["type"];
  required?: boolean;
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={name} className="ml-2">
            {label} {required && <span className="text-red-500">*</span>}
          </FieldLabel>
          <Input
            id={name}
            type={type}
            {...field}
            aria-invalid={fieldState.invalid}
            required={required}
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
