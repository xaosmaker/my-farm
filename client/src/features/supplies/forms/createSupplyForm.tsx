"use client";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { FieldGroup } from "@/components/ui/field";
import { SuppliesRequest, suppliesValidator } from "../validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, useTransition } from "react";
import { createSupplyAction } from "../actions/createSuppliesActions";
import BaseForm from "@/components/BaseForm";
import ControlledInput from "@/components/ControlledInput";
import ControlledSelect from "@/components/ControlledSelect";
import { MEASUREMENT_UNITS, SUPPLIES_TYPES } from "@/types/sharedTypes";
import { engToGreek } from "@/lib/translateMap";

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
    <BaseForm
      cardTitle="Δημιουργία εφοδίων"
      cardDescription="Δημιουργία εφοδίων για τη φάρμα σας"
      buttonChildren={
        <>
          <Button
            onClick={() => reset()}
            type="button"
            variant="outline"
            disabled={isPending}
          >
            Reset
          </Button>
          <Button type="submit" form="create-field-form" disabled={isPending}>
            Δημιουργία
          </Button>
        </>
      }
    >
      <form id="create-field-form" onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <ControlledInput control={control} name="name" label="Όνομα" />

          <ControlledInput
            control={control}
            name="nickname"
            label="Ψευδώνυμο"
          />

          <ControlledSelect
            control={control}
            name="measurementUnit"
            placeholder="Μονάδα μέτρησης"
            values={MEASUREMENT_UNITS.map((item) => ({
              value: item,
              label: engToGreek.get(item) || item,
            }))}
          />

          <ControlledSelect
            control={control}
            name="supplyType"
            placeholder="Κατηγορία"
            values={SUPPLIES_TYPES.map((item) => ({
              value: item,
              label: engToGreek.get(item) || item,
            }))}
          />
        </FieldGroup>
      </form>
    </BaseForm>
  );
}
