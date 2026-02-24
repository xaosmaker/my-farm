"use client";

import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { Field, FieldError, FieldLabel } from "./ui/field";
import { DateTimePicker24h } from "./ui/date-time-picker";

export default function ControlledDateTimePicker<T extends FieldValues>({
  name,
  label,
  control,
  required,
}: {
  name: Path<T>;
  label: string;
  control: Control<T>;
  required?: boolean;
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange }, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel className="ml-2">
            {label} {required && <span className="text-red-500">*</span>}
          </FieldLabel>
          <DateTimePicker24h value={value} onChange={onChange} />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
