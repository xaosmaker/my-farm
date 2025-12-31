"use client";
import BaseForm from "@/components/BaseForm";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { Farm, farmValidators } from "@/features/farm/farmValidators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, useTransition } from "react";
import { CreateFarmAction } from "../actions/CreateFarmAction";

export default function CreateFarmForm() {
  const { control, handleSubmit } = useForm<Farm>({
    defaultValues: {
      name: "",
    },
    resolver: zodResolver(farmValidators),
    mode: "onChange",
  });

  const [_, action] = useActionState(CreateFarmAction, undefined);
  const [isPending, startTransition] = useTransition();
  function farmSubmit(data: Farm) {
    startTransition(() => {
      action(data);
    });
  }

  return (
    <BaseForm
      cardDescription="Create your farm"
      cardTitle="Create Farm"
      buttonChildren={
        <>
          <Button type="reset" variant="ghost" disabled={isPending}>
            Reset
          </Button>
          <Button form="create-farm-form" disabled={isPending}>
            Submit
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(farmSubmit)} id="create-farm-form">
        <FieldGroup>
          <Controller
            control={control}
            name="name"
            render={({ fieldState, field }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="farmName">Farm Name</FieldLabel>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  id="farmName"
                />
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
