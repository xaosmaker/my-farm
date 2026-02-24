"use client";

import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { Field, FieldLabel } from "./ui/field";
import { DateTimePicker24h } from "./ui/date-time-picker";

export default function ControlledDateTimePicker<T extends FieldValues>({
  name,
  label,
  control,
}: {
  name: Path<T>;
  label: string;
  control: Control<T>;
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange } }) => (
        <Field>
          <FieldLabel className="ml-2">{label}</FieldLabel>
          <DateTimePicker24h value={value} onChange={onChange} />
        </Field>
      )}
    />
  );
}
