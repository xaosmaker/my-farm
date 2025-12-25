"use client";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { type FieldFormData, fieldValidator } from "../validators";
import { Switch } from "@/components/ui/switch";
import { useActionState, useTransition } from "react";
import { createFieldAction } from "../actions";

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
    <Card className="mx-auto w-1/3">
      <CardHeader>
        <CardTitle>Create Field</CardTitle>
        <CardDescription>Create a field to manage</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="create-field-form" onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              control={control}
              name="name"
              render={({ fieldState, field }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="name">Field Name</FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    id="name"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={control}
              name="fieldLocation"
              render={({ fieldState, field }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="fieldLocation">
                    Field Location
                  </FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    id="fieldLocation"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={control}
              name="areaInMeters"
              render={({ fieldState, field }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="areaInMeters">area in Meters</FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    id="areaInMeters"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
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
            {/* <Field> */}
            {/*   <FieldLabel htmlFor="name">Gov PDF</FieldLabel> */}
            {/*   <Input */}
            {/*     type="file" */}
            {/*     accept=".pdf" */}
            {/*     {...register("govPDF")} */}
            {/*     id="name" */}
            {/*   /> */}
            {/**/}
            {/*   {errors.govPDF?.message && ( */}
            {/*     <FieldError errors={[{ message: errors.govPDF.message }]} /> */}
            {/*   )} */}
            {/* </Field> */}
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
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
        </Field>
      </CardFooter>
    </Card>
  );
}
