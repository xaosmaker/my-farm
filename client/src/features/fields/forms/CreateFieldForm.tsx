"use client";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { type FieldFormData, fieldValidator } from "../validators";
import { Switch } from "@/components/ui/switch";
import { useActionState, useTransition } from "react";
import { createFieldAction } from "../actions";
import BaseForm from "@/components/BaseForm";
import ControlledInput from "@/components/ControlledInput";

export default function CreateFieldForm() {
  const { control, reset, handleSubmit } = useForm<FieldFormData>({
    mode: "onChange",
    resolver: zodResolver(fieldValidator),
    shouldFocusError: true,
    defaultValues: {
      name: "",
      isOwned: false,
      fieldLocation: "",
      areaInMeters: "",
      govPDF: null,
    },
  });
  const [_, action] = useActionState(createFieldAction, undefined);
  const [isPending, startTransition] = useTransition();

  function onSubmit(data: FieldFormData) {
    startTransition(() => {
      action(data);
    });
  }

  return (
    <BaseForm
      cardTitle="Create Field"
      cardDescription="Create a field to manage"
      buttonChildren={
        <>
          <Button
            disabled={isPending}
            onClick={() => reset()}
            type="button"
            variant="outline"
          >
            Reset
          </Button>
          <Button type="submit" form="create-field-form" disabled={isPending}>
            Create Field
          </Button>
        </>
      }
    >
      <form id="create-field-form" onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <ControlledInput control={control} name="name" label="Field Name" />

          <ControlledInput
            control={control}
            name="fieldLocation"
            label="Field Locations"
          />
          <ControlledInput
            control={control}
            name="areaInMeters"
            label="Area in meters"
          />

          <Controller
            control={control}
            name="isOwned"
            render={({ fieldState, field: { value, onChange } }) => (
              <Field
                data-invalid={fieldState.invalid}
                className="flex flex-row"
              >
                <Switch
                  className="grow-0 basis-8"
                  checked={value}
                  onCheckedChange={onChange}
                  aria-invalid={fieldState.invalid}
                  id="is owned"
                />
                <FieldLabel htmlFor="isOwned" className="flex-1">
                  Is owned
                </FieldLabel>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
      </form>
    </BaseForm>
  );
}
