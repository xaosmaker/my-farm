"use client";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
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
import { SuppliesRequest, suppliesValidator } from "../validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, useTransition } from "react";
import { createSupplyAction } from "../actions/createSuppliesActions";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export default function CreateSupplyForm() {
  const { control, reset, handleSubmit } = useForm<SuppliesRequest>({
    mode: "onChange",
    resolver: zodResolver(suppliesValidator),
    shouldFocusError: true,
    defaultValues: {
      name: "",
      nickname: "",
      supplyType: "",
      measurementUnit: "",
    },
  });
  const [_, action] = useActionState(createSupplyAction, undefined);
  const [isPending, startTransition] = useTransition();

  function onSubmit(data: SuppliesRequest) {
    startTransition(() => {
      action(data);
    });
  }

  return (
    <Card className="mx-auto w-1/3">
      <CardHeader>
        <CardTitle>Create Supplies</CardTitle>
        <CardDescription>Create a Supply to manage</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="create-field-form" onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              control={control}
              name="name"
              render={({ fieldState, field }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="name">name</FieldLabel>
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
              name="nickname"
              render={({ fieldState, field }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="nickname">nickname</FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    id="nickname"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={control}
              name="measurementUnit"
              render={({ fieldState, field: { value, onChange } }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Select value={value} onValueChange={onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="KG">kilograms</SelectItem>
                      <SelectItem value="L">Litres</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={control}
              name="supplyType"
              render={({ fieldState, field }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Supply Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="chemicals">Chemicals</SelectItem>
                      <SelectItem value="fertilizers">Fertilizers</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button
            onClick={() => reset()}
            type="button"
            variant="outline"
            disabled={isPending}
          >
            Reset
          </Button>
          <Button type="submit" form="create-field-form" disabled={isPending}>
            Create Supplies
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
